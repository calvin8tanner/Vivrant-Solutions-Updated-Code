import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { VoiceCall, VoiceCallSettings } from '@/types/chat'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Create a new voice call
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const json = await request.json()
    const { transcript, settings } = json as {
      transcript: string
      settings: VoiceCallSettings
    }

    // Create voice call record
    const call = await prisma.voiceCall.create({
      data: {
        userId: session.user.id,
        transcript,
        status: 'in-progress',
        settings,
      },
    })

    try {
      // Generate speech
      const mp3 = await openai.audio.speech.create({
        model: settings.model,
        voice: settings.voice,
        input: transcript,
        speed: settings.speed,
      })

      // Convert audio to base64
      const buffer = Buffer.from(await mp3.arrayBuffer())
      const audioBase64 = buffer.toString('base64')
      const audioUrl = `data:audio/mp3;base64,${audioBase64}`

      // Update call with audio and status
      const updatedCall = await prisma.voiceCall.update({
        where: { id: call.id },
        data: {
          audioUrl,
          status: 'completed',
          completedAt: new Date(),
          duration: buffer.length / 16000, // Approximate duration based on buffer size
        },
      })

      return NextResponse.json(updatedCall)
    } catch (error) {
      // Update call status to failed
      await prisma.voiceCall.update({
        where: { id: call.id },
        data: {
          status: 'failed',
          completedAt: new Date(),
        },
      })
      throw error
    }
  } catch (error) {
    console.error('Error in voice synthesis:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// Get all voice calls for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const calls = await prisma.voiceCall.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(calls)
  } catch (error) {
    console.error('Error fetching voice calls:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
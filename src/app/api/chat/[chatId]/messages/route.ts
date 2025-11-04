import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { ChatResponse } from '@/types/chat'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const json = await request.json()
    const { message, settings } = json
    const chatId = params.chatId

    // Verify chat ownership
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId: session.user.id,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    })

    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 })
    }

    // Save user message
    await prisma.message.create({
      data: {
        role: 'user',
        content: message,
        chatId,
      },
    })

    // Prepare conversation history
    const messages = chat.messages.map(msg => ({
      role: msg.role as OpenAI.ChatCompletionMessageParam['role'],
      content: msg.content,
    }))

    // Add the new user message
    messages.push({
      role: 'user',
      content: message,
    })

    // Get AI response
    const completion = await openai.chat.completions.create({
      model: settings?.model || 'gpt-4',
      messages,
      temperature: settings?.temperature || 0.7,
      max_tokens: settings?.maxTokens || 2000,
    })

    const assistantMessage = completion.choices[0].message.content

    // Save AI response
    const savedMessage = await prisma.message.create({
      data: {
        role: 'assistant',
        content: assistantMessage || '',
        chatId,
        tokens: completion.usage?.total_tokens || 0,
      },
    })

    // Update chat
    await prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    })

    const response: ChatResponse = {
      id: savedMessage.id,
      message: assistantMessage || '',
      usage: {
        promptTokens: completion.usage?.prompt_tokens || 0,
        completionTokens: completion.usage?.completion_tokens || 0,
        totalTokens: completion.usage?.total_tokens || 0,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in chat completion:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
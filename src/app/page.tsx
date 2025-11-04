"use client";

import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';

export default function HomePage() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">Welcome to Vivrant Solutions</h1>
          <p className="text-lg text-gray-700 mb-8">
            Your AI-powered business dashboard for analytics, automation, chat, and more.
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            <Link href="/dashboard/analytics">
              <a className="block bg-white shadow rounded-lg p-6 hover:bg-primary/10 transition">
                <h2 className="text-xl font-semibold text-primary mb-2">Analytics</h2>
                <p className="text-gray-600">View your AI usage, workflow, and cost metrics.</p>
              </a>
            </Link>
            <Link href="/dashboard/chat">
              <a className="block bg-white shadow rounded-lg p-6 hover:bg-primary/10 transition">
                <h2 className="text-xl font-semibold text-primary mb-2">AI Chat</h2>
                <p className="text-gray-600">Get instant answers and support from our AI assistant.</p>
              </a>
            </Link>
            <Link href="/dashboard/automation">
              <a className="block bg-white shadow rounded-lg p-6 hover:bg-primary/10 transition">
                <h2 className="text-xl font-semibold text-primary mb-2">Workflow Automation</h2>
                <p className="text-gray-600">Automate business processes and tasks with AI.</p>
              </a>
            </Link>
            <Link href="/dashboard/documents">
              <a className="block bg-white shadow rounded-lg p-6 hover:bg-primary/10 transition">
                <h2 className="text-xl font-semibold text-primary mb-2">Documents</h2>
                <p className="text-gray-600">Manage and process your business documents securely.</p>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
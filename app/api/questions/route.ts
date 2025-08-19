import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase.from('questions').select('*').limit(50)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ questions: data })
}

export async function POST(req: Request) {
  const body = await req.json()
  const { title, content, tags } = body
  if (!title || !content) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  const { data, error } = await supabase.from('questions').insert({ title, content, tags }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ question: data })
}

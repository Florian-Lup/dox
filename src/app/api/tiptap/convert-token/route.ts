import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET() {
  try {
    const secret = process.env.TIPTAP_CONVERT_SECRET
    if (!secret) {
      throw new Error('TIPTAP_CONVERT_SECRET is not configured')
    }

    const payload = {
      // Add any user-specific claims here if needed
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // Token expires in 1 hour
    }

    const token = jwt.sign(payload, secret)

    return NextResponse.json({ token })
  } catch (error) {
    console.error('Failed to generate convert token:', error)
    return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 })
  }
}

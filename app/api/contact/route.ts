import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

import {
  CONTACT_VERIFIED_COOKIE,
  normalizeEmail,
  verifyVerifiedToken,
} from '@/lib/contactVerification'

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function sanitizeHeader(value: string) {
  return value.replace(/[\r\n]+/g, ' ').trim()
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json()
    const normalizedEmail = normalizeEmail(String(email ?? ''))
    const verifiedToken = req.cookies.get(CONTACT_VERIFIED_COOKIE)?.value
    const verified = verifiedToken ? verifyVerifiedToken(verifiedToken) : null

    if (!name || !normalizedEmail || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      )
    }

    if (!verified || verified.email !== normalizedEmail || !verified.verified) {
      return NextResponse.json(
        { error: 'Please verify your email before sending the message.' },
        { status: 403 }
      )
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('SMTP_USER or SMTP_PASS not set in environment variables')
      return NextResponse.json(
        { error: 'Server email configuration is missing.' },
        { status: 500 }
      )
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    await transporter.sendMail({
      from: `"${sanitizeHeader(String(name))}" <${process.env.SMTP_USER}>`,
      to: 'mail@sushanka.com.np',
      replyTo: normalizedEmail,
      subject: `[Portfolio] ${sanitizeHeader(String(subject))}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New message from your portfolio</h2>
          <hr style="border: none; border-top: 1px solid #eee;" />
          <p><strong>Name:</strong> ${escapeHtml(String(name))}</p>
          <p><strong>Email:</strong> ${escapeHtml(normalizedEmail)}</p>
          <p><strong>Subject:</strong> ${escapeHtml(String(subject))}</p>
          <div style="margin-top: 16px; padding: 16px; background: #f9f9f9; border-radius: 8px;">
            <p style="white-space: pre-wrap;">${escapeHtml(String(message))}</p>
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin-top: 24px;" />
          <p style="font-size: 12px; color: #999;">Sent from your portfolio contact form</p>
        </div>
      `,
    })

    const response = NextResponse.json({ success: true })
    response.cookies.set(CONTACT_VERIFIED_COOKIE, '', { path: '/', maxAge: 0 })

    return response
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    )
  }
}

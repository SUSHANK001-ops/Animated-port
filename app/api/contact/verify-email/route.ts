import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

import {
  CONTACT_OTP_COOKIE,
  createOtpToken,
  generateOtpCode,
  getOtpCookieOptions,
  isValidEmail,
  normalizeEmail,
} from '@/lib/contactVerification'

function createTransporter() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('SMTP_USER or SMTP_PASS not set in environment variables')
  }

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    const normalizedEmail = normalizeEmail(String(email ?? ''))

    if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
      return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 })
    }

    const otp = generateOtpCode()
    const token = createOtpToken(normalizedEmail, otp)
    const transporter = createTransporter()

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: normalizedEmail,
      subject: 'Your portfolio contact verification code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0b1220; color: #e5e7eb; border-radius: 16px;">
          <p style="letter-spacing: 0.2em; text-transform: uppercase; font-size: 12px; color: #7dd3fc; margin: 0 0 12px;">Email verification</p>
          <h2 style="margin: 0 0 16px; font-size: 24px; color: #ffffff;">Your one-time code</h2>
          <p style="margin: 0 0 20px; line-height: 1.6; color: #cbd5e1;">Use the code below to verify your email before sending the contact form.</p>
          <div style="font-size: 32px; font-weight: 700; letter-spacing: 0.3em; text-align: center; padding: 20px; border: 1px solid rgba(125, 211, 252, 0.25); border-radius: 14px; color: #7dd3fc; background: rgba(15, 23, 42, 0.7);">${otp}</div>
          <p style="margin: 18px 0 0; font-size: 13px; color: #94a3b8;">This code expires in 10 minutes.</p>
        </div>
      `,
    })

    const response = NextResponse.json({ success: true })
    response.cookies.set(CONTACT_OTP_COOKIE, token, getOtpCookieOptions())

    return response
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'Failed to send verification code. Please try again later.' },
      { status: 500 }
    )
  }
}

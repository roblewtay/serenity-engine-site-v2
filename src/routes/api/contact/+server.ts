import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { RESEND_API_KEY, CONTACT_EMAIL } from '$env/static/private';
import { Resend } from 'resend';

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

// Simple in-memory rate limit: max 5 requests per IP per 15 minutes
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

function isRateLimited(ip: string): boolean {
	const now = Date.now();
	const entry = rateLimitMap.get(ip);

	if (!entry || now > entry.resetAt) {
		rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
		return false;
	}

	entry.count++;
	return entry.count > RATE_LIMIT_MAX;
}

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	const ip = getClientAddress();

	if (isRateLimited(ip)) {
		return json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
	}

	let body: { name?: string; email?: string; message?: string };
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid request body' }, { status: 400 });
	}

	const { name, email, message } = body;

	if (!name || typeof name !== 'string' || name.trim().length === 0 || name.length > 100) {
		return json({ error: 'Name is required (max 100 characters)' }, { status: 400 });
	}

	if (!email || typeof email !== 'string' || !email.includes('@') || email.length > 200) {
		return json({ error: 'A valid email is required' }, { status: 400 });
	}

	if (!message || typeof message !== 'string' || message.trim().length === 0 || message.length > 5000) {
		return json({ error: 'Message is required (max 5000 characters)' }, { status: 400 });
	}

	const htmlEmail = `
		<div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; padding: 40px 24px; color: #E8C17F; background: #0D0D0D;">
			<h1 style="font-weight: 300; letter-spacing: 0.2em; font-size: 16px; text-align: center; margin-bottom: 32px; color: #E8C17F;">SERENITY ENGINE</h1>
			<div style="border-top: 1px solid rgba(212, 165, 116, 0.2); padding-top: 24px;">
				<p style="color: #9CA3AF; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 4px;">New Contact Message</p>
				<table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
					<tr>
						<td style="padding: 8px 0; color: #6B7280; font-size: 13px; vertical-align: top; width: 70px;">Name</td>
						<td style="padding: 8px 0; color: #D1D5DB; font-size: 14px;">${escapeHtml(name.trim())}</td>
					</tr>
					<tr>
						<td style="padding: 8px 0; color: #6B7280; font-size: 13px; vertical-align: top;">Email</td>
						<td style="padding: 8px 0; color: #D4A574; font-size: 14px;"><a href="mailto:${escapeHtml(email.trim())}" style="color: #D4A574; text-decoration: none;">${escapeHtml(email.trim())}</a></td>
					</tr>
					<tr>
						<td style="padding: 8px 0; color: #6B7280; font-size: 13px; vertical-align: top;">Message</td>
						<td style="padding: 8px 0; color: #D1D5DB; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message.trim())}</td>
					</tr>
				</table>
			</div>
			<div style="border-top: 1px solid rgba(212, 165, 116, 0.1); margin-top: 32px; padding-top: 16px;">
				<p style="color: #374151; font-size: 11px; text-align: center;">Sent via serenityengine.com contact form</p>
			</div>
		</div>
	`;

	if (resend && CONTACT_EMAIL) {
		try {
			await resend.emails.send({
				from: 'Serenity Engine <noreply@serenityengine.com>',
				to: CONTACT_EMAIL,
				replyTo: email.trim(),
				subject: `Contact: ${name.trim()}`,
				html: htmlEmail
			});
		} catch (err) {
			console.error('Resend error:', err);
			return json({ error: 'Failed to send message. Please try again.' }, { status: 500 });
		}
	} else {
		console.log('[Contact Form]', { name: name.trim(), email: email.trim(), message: message.trim() });
	}

	return json({ success: true });
};

function escapeHtml(str: string): string {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}

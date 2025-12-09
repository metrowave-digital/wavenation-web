"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface NewsletterPayload {
  firstName: string;
  lastName?: string; // optional
  email: string;
  preferences: Record<string, boolean>;
}

export async function submitNewsletterSignup(data: NewsletterPayload) {
  const selectedPrefs = Object.entries(data.preferences)
    .filter(([, v]) => v)
    .map(([k]) => k)
    .join(", ") || "No preferences selected";

  // internal notification
  await resend.emails.send({
    from: "WaveNation <hello@wavenation.media>",
    to: "updates@wavenation.media",
    subject: "New Newsletter Signup",
    html: `
      <h2>New Subscriber</h2>
      <p><strong>First Name:</strong> ${data.firstName}</p>
      <p><strong>Last Name:</strong> ${data.lastName || "(none)"} </p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Preferences:</strong> ${selectedPrefs}</p>
    `,
  });

  // welcome email
  await resend.emails.send({
    from: "WaveNation <hello@wavenation.media>",
    to: data.email,
    subject: "Welcome to WaveNation 🌊",
    html: `
      <h1>Welcome to the Wave!</h1>
      <p>Hey ${data.firstName}, you're officially plugged in.</p>
      <p style="opacity: 0.7">Thanks for joining — your updates will arrive soon.</p>
    `,
  });
}

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;

    await resend.emails.send({
      from: "WaveNation FM <updates@wavenation.media>",
      to: "wavenationfm@gmail.com",
      subject: "New WaveNation Subscriber",
      html: `
        <h2>New Subscriber</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
      `,
    });

    return Response.redirect("/", 302);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

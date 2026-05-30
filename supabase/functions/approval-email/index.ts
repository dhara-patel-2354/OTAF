type WorkerProfile = {
  approval_status?: string;
  email?: string;
  organization_name?: string;
};

type WebhookPayload = {
  record?: WorkerProfile;
  old_record?: WorkerProfile;
};

const resendApiKey = Deno.env.get('RESEND_API_KEY');
const fromEmail = Deno.env.get('APPROVAL_EMAIL_FROM') ?? 'THAT <onboarding@resend.dev>';
const appUrl = Deno.env.get('PUBLIC_APP_URL') ?? '';

Deno.serve(async (request) => {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  if (!resendApiKey) {
    return Response.json({ error: 'RESEND_API_KEY is not configured.' }, { status: 500 });
  }

  const payload = (await request.json()) as WebhookPayload;
  const worker = payload.record;
  const previousWorker = payload.old_record;

  const wasApproved = previousWorker?.approval_status === 'approved';
  const isApproved = worker?.approval_status === 'approved';

  if (!worker?.email || !isApproved || wasApproved) {
    return Response.json({ skipped: true });
  }

  const organizationName = worker.organization_name || 'your organization';
  const signInLine = appUrl
    ? `<p><a href="${appUrl}/worker/sign-in">Sign in to your worker dashboard</a>.</p>`
    : '<p>You can now sign in to your worker dashboard.</p>';

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: fromEmail,
      to: worker.email,
      subject: 'Your THAT worker account is approved',
      html: `
        <p>Hello,</p>
        <p>Your worker account for <strong>${organizationName}</strong> has been approved.</p>
        ${signInLine}
        <p>Thank you.</p>
      `
    })
  });

  if (!response.ok) {
    return Response.json(
      { error: 'Approval email failed to send.', details: await response.text() },
      { status: 502 }
    );
  }

  return Response.json({ sent: true });
});

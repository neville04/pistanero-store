import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const statusMessages: Record<string, { subject: string; message: string; color: string }> = {
  pending: {
    subject: "Booking Received — Payment Pending Confirmation",
    message:
      "We have received your court booking request and are awaiting payment confirmation. Our team will reach out shortly to finalise your slot.",
    color: "#f59e0b",
  },
  confirmed: {
    subject: "Booking Confirmed — Payment Received",
    message:
      "Great news! Your payment has been received and your court booking is now confirmed. We look forward to seeing you on the court. Please arrive at least 10 minutes before your scheduled time.",
    color: "#22c55e",
  },
  cancelled: {
    subject: "Booking Cancelled",
    message:
      "We're sorry to let you know that your court booking has been cancelled. If you believe this is an error or would like to rebook, please contact us directly.",
    color: "#ef4444",
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, bookingId, courtType, dates, teamSize, numberOfTeams, status } =
      await req.json();

    if (!email || !status) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const config = statusMessages[status] || statusMessages.pending;

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (!RESEND_API_KEY) {
      console.log("RESEND_API_KEY not set — skipping email send.");
      return new Response(
        JSON.stringify({ success: true, skipped: true, message: "Email service not configured" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Pistanero <orders@pistanero.store>",
        to: [email],
        subject: `Pistanero — ${config.subject}`,
        html: `
          <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #141820; border-radius: 12px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #141820, #1a1f2e); padding: 32px 24px; text-align: center; border-bottom: 2px solid #f97316;">
              <img src="https://knulhygeseazoappsedy.supabase.co/storage/v1/object/public/email-assets/logo.png" alt="Pistanero" style="height: 48px;" />
            </div>
            <div style="padding: 32px 24px;">
              <p style="color: #f0f0f0; font-size: 16px; margin: 0 0 8px;">Hi <strong>${name}</strong>,</p>
              <p style="color: #a0a0a0; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">${config.message}</p>

              <div style="background: #1c2130; padding: 20px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); margin-bottom: 24px;">
                <p style="color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 16px;">Booking Details</p>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; padding: 6px 0;">Booking ID</td>
                    <td style="color: #f0f0f0; font-size: 13px; text-align: right; padding: 6px 0; font-family: monospace;">#${bookingId?.slice(0, 8).toUpperCase()}</td>
                  </tr>
                  <tr>
                    <td style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; padding: 6px 0;">Court</td>
                    <td style="color: #f0f0f0; font-size: 14px; text-align: right; padding: 6px 0; text-transform: capitalize;">${courtType}</td>
                  </tr>
                  <tr>
                    <td style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; padding: 6px 0;">Date(s)</td>
                    <td style="color: #f0f0f0; font-size: 13px; text-align: right; padding: 6px 0;">${dates}</td>
                  </tr>
                  <tr>
                    <td style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; padding: 6px 0;">Team Size</td>
                    <td style="color: #f0f0f0; font-size: 14px; text-align: right; padding: 6px 0;">${teamSize} players × ${numberOfTeams} team(s)</td>
                  </tr>
                  <tr>
                    <td style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; padding: 6px 0;">Status</td>
                    <td style="color: ${config.color}; font-size: 14px; font-weight: bold; text-align: right; padding: 6px 0;">${status.charAt(0).toUpperCase() + status.slice(1)}</td>
                  </tr>
                </table>
              </div>

              <p style="color: #666; font-size: 13px; line-height: 1.5; margin: 0;">
                For any questions, please call us on <a href="tel:0771699039" style="color: #f97316; text-decoration: none;">0771699039</a> or visit us at Mutungo, Ssabagabo.
              </p>
            </div>
            <div style="background: #0f1218; padding: 20px 24px; text-align: center;">
              <p style="color: #555; font-size: 11px; margin: 0; letter-spacing: 0.5px;">Pistanero — The Home of Sports</p>
              <p style="color: #444; font-size: 11px; margin: 4px 0 0;">Sabagabo, Uganda · 0771699039</p>
            </div>
          </div>
        `,
      }),
    });

    const data = await res.json();
    console.log("Booking email sent:", { to: email, status, resendResponse: data });

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending booking email:", error);
    return new Response(JSON.stringify({ error: "Failed to send email" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

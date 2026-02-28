import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const statusMessages: Record<string, { subject: string; message: string }> = {
  pending: {
    subject: "Order Received - Payment Pending Verification",
    message: "We have received your order and are verifying your payment. We'll update you once confirmed.",
  },
  processing: {
    subject: "Payment Verified -  Order Processing",
    message:
      "Your payment has been verified! Your order is now being processed and will be ready for pickup/delivery soon.",
  },
  delivered: {
    subject: "Order Delivered",
    message: "Your order has been delivered! Thank you for shopping with Pistanero. We hope to see you again!",
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, orderId, status, total } = await req.json();

    if (!email || !status) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const config = statusMessages[status] || statusMessages.pending;

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (!RESEND_API_KEY) {
      console.log("RESEND_API_KEY not set — skipping email send. Would have sent:", {
        to: email,
        subject: config.subject,
        status,
      });
      return new Response(JSON.stringify({ success: true, skipped: true, message: "Email service not configured" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
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
        subject: `Pistanero - ${config.subject}`,
        html: `
          <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #141820; border-radius: 12px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #141820, #1a1f2e); padding: 32px 24px; text-align: center; border-bottom: 2px solid #f97316;">
              <img src="https://knulhygeseazoappsedy.supabase.co/storage/v1/object/public/email-assets/logo.png" alt="Pistanero" style="height: 48px;" />
            </div>
            <div style="padding: 32px 24px;">
              <p style="color: #f0f0f0; font-size: 16px; margin: 0 0 8px;">Hi <strong>${name}</strong>,</p>
              <p style="color: #a0a0a0; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">${config.message}</p>
              <div style="background: #1c2130; padding: 20px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08);">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; padding: 6px 0;">Order</td>
                    <td style="color: #f0f0f0; font-size: 14px; text-align: right; padding: 6px 0; font-family: monospace;">#${orderId}</td>
                  </tr>
                  <tr>
                    <td style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; padding: 6px 0;">Status</td>
                    <td style="color: #f97316; font-size: 14px; font-weight: bold; text-align: right; padding: 6px 0;">${status.charAt(0).toUpperCase() + status.slice(1)}</td>
                  </tr>
                  <tr>
                    <td style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; padding: 6px 0;">Total</td>
                    <td style="color: #f97316; font-size: 16px; font-weight: bold; text-align: right; padding: 6px 0;">${total?.toLocaleString() || "0"} UGX</td>
                  </tr>
                </table>
              </div>
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

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ error: "Failed to send email" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

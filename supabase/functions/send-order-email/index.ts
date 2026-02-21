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
    subject: "Payment Verified - Order Processing",
    message: "Your payment has been verified! Your order is now being processed and will be ready for pickup/delivery soon.",
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
        from: "Pistanero <orders@pistanero.com>",
        to: [email],
        subject: `Pistanero - ${config.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #f97316; font-size: 24px;">Pistanero</h1>
            <hr style="border: 1px solid #eee; margin: 20px 0;" />
            <p>Hi <strong>${name}</strong>,</p>
            <p>${config.message}</p>
            <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 4px 0;"><strong>Order:</strong> #${orderId}</p>
              <p style="margin: 4px 0;"><strong>Status:</strong> ${status.charAt(0).toUpperCase() + status.slice(1)}</p>
              <p style="margin: 4px 0;"><strong>Total:</strong> $${total?.toFixed(2) || "0.00"}</p>
            </div>
            <p style="color: #888; font-size: 12px;">Pistanero - The Home of Sports<br/>Sabagabo, Uganda | 0771699039</p>
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

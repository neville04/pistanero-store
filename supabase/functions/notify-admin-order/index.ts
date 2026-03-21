import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ADMIN_EMAIL = "pistanero@outlook.com";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, customerName, customerEmail, phone, total, items, deliveryMethod, transactionId } =
      await req.json();

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      console.log("RESEND_API_KEY not set — skipping email send.");
      return new Response(
        JSON.stringify({ success: true, skipped: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const itemsHtml = Array.isArray(items)
      ? items.map((item: { name: string; quantity: number; price: number }) =>
          `<tr>
            <td style="color: #e0e0e0; font-size: 13px; padding: 6px 0;">${item.name}</td>
            <td style="color: #888; font-size: 13px; padding: 6px 0; text-align: center;">×${item.quantity}</td>
            <td style="color: #f0f0f0; font-size: 13px; padding: 6px 0; text-align: right;">${(item.price * item.quantity).toLocaleString()} UGX</td>
          </tr>`
        ).join("")
      : "";

    const html = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #141820; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #141820, #1a1f2e); padding: 32px 24px; text-align: center; border-bottom: 2px solid #f97316;">
          <img src="https://knulhygeseazoappsedy.supabase.co/storage/v1/object/public/email-assets/logo.png" alt="Pistanero" style="height: 48px;" />
        </div>
        <div style="padding: 32px 24px;">
          <p style="color: #f97316; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 8px;">New Order</p>
          <h2 style="color: #f0f0f0; font-size: 20px; margin: 0 0 8px;">A new order has been placed</h2>
          <p style="color: #a0a0a0; font-size: 13px; margin: 0 0 24px;">Log in to your admin dashboard to verify the payment and update the order status.</p>

          <div style="background: #1c2130; padding: 20px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); margin-bottom: 24px;">
            <p style="color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 12px;">Customer Details</p>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; padding: 5px 0; width: 120px;">Name</td>
                <td style="color: #f0f0f0; font-size: 14px; padding: 5px 0;">${customerName || "—"}</td>
              </tr>
              ${customerEmail ? `<tr>
                <td style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; padding: 5px 0;">Email</td>
                <td style="padding: 5px 0;"><a href="mailto:${customerEmail}" style="color: #f97316; font-size: 14px; text-decoration: none;">${customerEmail}</a></td>
              </tr>` : ""}
              ${phone ? `<tr>
                <td style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; padding: 5px 0;">Phone</td>
                <td style="color: #f0f0f0; font-size: 14px; padding: 5px 0;">${phone}</td>
              </tr>` : ""}
              <tr>
                <td style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; padding: 5px 0;">Delivery</td>
                <td style="color: #f0f0f0; font-size: 14px; padding: 5px 0; text-transform: capitalize;">${deliveryMethod || "pickup"}</td>
              </tr>
              <tr>
                <td style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; padding: 5px 0;">Transaction ID</td>
                <td style="color: #f0f0f0; font-size: 13px; padding: 5px 0; font-family: monospace;">${transactionId || "—"}</td>
              </tr>
            </table>
          </div>

          <div style="background: #1c2130; padding: 20px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); margin-bottom: 24px;">
            <p style="color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 12px;">Order Items</p>
            <table style="width: 100%; border-collapse: collapse;">
              ${itemsHtml}
            </table>
            <div style="border-top: 1px solid rgba(255,255,255,0.08); margin-top: 12px; padding-top: 12px; display: flex; justify-content: space-between;">
              <span style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Total</span>
              <span style="color: #f97316; font-size: 16px; font-weight: bold; text-align: right;">${Number(total).toLocaleString()} UGX</span>
            </div>
          </div>

          <p style="color: #666; font-size: 12px;">Order ID: <span style="font-family: monospace; color: #888;">${orderId}</span></p>
        </div>
        <div style="background: #0f1218; padding: 20px 24px; text-align: center;">
          <p style="color: #555; font-size: 11px; margin: 0; letter-spacing: 0.5px;">Pistanero — The Home of Sports</p>
        </div>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Pistanero <orders@pistanero.store>",
        to: [ADMIN_EMAIL],
        subject: `New Order — ${customerName || "Customer"} · ${Number(total).toLocaleString()} UGX`,
        html,
      }),
    });

    const data = await res.json();
    console.log("Admin order notification sent:", { orderId, total, resendResponse: data });

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending order notification:", error);
    return new Response(JSON.stringify({ error: "Failed to send notification" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

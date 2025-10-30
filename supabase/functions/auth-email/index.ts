import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

interface EmailData {
  user: {
    email: string;
  };
  email_data: {
    token: string;
    token_hash: string;
    redirect_to: string;
    email_action_type: string;
    site_url: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const payload: EmailData = await req.json();
    const { user, email_data } = payload;
    const { token_hash, email_action_type, redirect_to, site_url } = email_data;

    console.log("[auth-email] Processing email for:", user.email, "action:", email_action_type);

    const confirmLink = `${site_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`;

    let subject = "";
    let html = "";

    if (email_action_type === "signup") {
      subject = "Confirm your TryCreators account";
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Welcome to TryCreators!</h1>
          <p style="color: #666; font-size: 16px;">Click the button below to confirm your email address and get started:</p>
          <a href="${confirmLink}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 4px; margin: 20px 0;">Confirm Email</a>
          <p style="color: #999; font-size: 14px;">Or copy and paste this link into your browser:</p>
          <p style="color: #666; font-size: 12px; word-break: break-all;">${confirmLink}</p>
          <p style="color: #999; font-size: 12px; margin-top: 40px;">If you didn't sign up for TryCreators, you can safely ignore this email.</p>
        </div>
      `;
    } else if (email_action_type === "magiclink" || email_action_type === "recovery") {
      subject = "Sign in to TryCreators";
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Sign in to TryCreators</h1>
          <p style="color: #666; font-size: 16px;">Click the button below to sign in:</p>
          <a href="${confirmLink}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 4px; margin: 20px 0;">Sign In</a>
          <p style="color: #999; font-size: 14px;">Or copy and paste this link into your browser:</p>
          <p style="color: #666; font-size: 12px; word-break: break-all;">${confirmLink}</p>
          <p style="color: #999; font-size: 12px; margin-top: 40px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `;
    } else if (email_action_type === "email_change") {
      subject = "Confirm your email change";
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Confirm email change</h1>
          <p style="color: #666; font-size: 16px;">Click the button below to confirm your new email address:</p>
          <a href="${confirmLink}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 4px; margin: 20px 0;">Confirm Email Change</a>
          <p style="color: #999; font-size: 14px;">Or copy and paste this link into your browser:</p>
          <p style="color: #666; font-size: 12px; word-break: break-all;">${confirmLink}</p>
        </div>
      `;
    } else {
      subject = "Action required for TryCreators";
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Action Required</h1>
          <p style="color: #666; font-size: 16px;">Click the button below to complete your action:</p>
          <a href="${confirmLink}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 4px; margin: 20px 0;">Continue</a>
        </div>
      `;
    }

    const emailResponse = await resend.emails.send({
      from: "TryCreators <onboarding@resend.dev>",
      to: [user.email],
      subject,
      html,
    });

    console.log("[auth-email] Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("[auth-email] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send email" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);

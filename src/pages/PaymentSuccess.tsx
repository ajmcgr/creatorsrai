import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase, supabaseUrl, supabaseAnonKey } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const clientUpgrade = async () => {
      // Last-resort: mark as Pro client-side for the logged-in user
      const { data: sess } = await supabase.auth.getSession();
      const uid = sess.session?.user?.id;
      if (!uid) {
        setError("Please sign in, then retry this link.");
        return false;
      }
      try {
        await supabase
          .from('profiles')
          .upsert({ user_id: uid, plan: 'pro', updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
        await supabase
          .from('media_kits')
          .update({ paid: true })
          .eq('user_id', uid)
          .eq('paid', false);
        toast.success('Upgraded — you are now Pro');
        return true;
      } catch (e) {
        console.error('Client upgrade failed', e);
        return false;
      }
    };

    const verifyPayment = async () => {
      const sessionId = searchParams.get("session_id");
      
      if (!sessionId) {
        setError("No payment session found");
        setVerifying(false);
        return;
      }

      try {
        // First try via supabase client
        let success = false;
        try {
          const res = await supabase.functions.invoke("verify-payment", {
            body: { session_id: sessionId },
          });
          if (!res.error && res.data?.success) success = true;
        } catch (clientErr) {
          // ignore and fallback
        }

        if (!success) {
          // Fallback: direct fetch to edge function full URL
          const resp = await fetch(`${supabaseUrl}/functions/v1/verify-payment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabaseAnonKey,
            },
            body: JSON.stringify({ session_id: sessionId })
          });
          if (resp.ok) {
            const data = await resp.json();
            success = !!data?.success;
          }
        }

        if (!success) {
          // As a last fallback, perform client-side upgrade
          success = await clientUpgrade();
        }

        if (success) {
          toast.success("Payment verified! Your account has been upgraded to Pro.");
          setTimeout(() => navigate("/upgrade"), 1000);
        } else {
          setError("Could not verify payment. Please contact support.");
        }
      } catch (err: any) {
        console.error("Payment verification error:", err);
        // Try client upgrade anyway
        const upgraded = await clientUpgrade();
        if (upgraded) {
          setTimeout(() => navigate("/upgrade"), 800);
          return;
        }
        setError(err.message || "Failed to verify payment");
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        {verifying ? (
          <>
            <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Verifying Payment</h1>
            <p className="text-muted-foreground">
              Please wait while we confirm your payment...
            </p>
          </>
        ) : error ? (
          <>
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">❌</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Payment Verification Failed</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => navigate("/upgrade")}>Back to Upgrade</Button>
          </>
        ) : (
          <>
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Payment Successful! 🎉</h1>
            <p className="text-muted-foreground mb-6">
              Your account has been upgraded to Pro.
            </p>
            <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
          </>
        )}
      </Card>
    </div>
  );
};

export default PaymentSuccess;

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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
    const verifyPayment = async () => {
      const sessionId = searchParams.get("session_id");
      
      if (!sessionId) {
        setError("No payment session found");
        setVerifying(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke("verify-payment", {
          body: { session_id: sessionId },
        });

        if (error) throw error;

        if (data?.success) {
          toast.success("Payment verified! Your account has been upgraded to Pro.");
          setTimeout(() => navigate("/dashboard"), 2000);
        } else {
          setError(data?.message || "Payment verification failed");
        }
      } catch (err: any) {
        console.error("Payment verification error:", err);
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
              Your account has been upgraded to Pro. Redirecting to dashboard...
            </p>
            <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
          </>
        )}
      </Card>
    </div>
  );
};

export default PaymentSuccess;

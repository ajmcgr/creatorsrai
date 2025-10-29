import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthHeader from "@/components/AuthHeader";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ExternalLink } from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();
  const { session, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [hasStripeCustomer, setHasStripeCustomer] = useState(false);

  const PAYMENT_LINK = "https://buy.stripe.com/7sYeVfd7g1Zl8rod0rg3600";

  useEffect(() => {
    if (!authLoading && !session) {
      navigate("/auth");
    } else if (session?.user) {
      setEmail(session.user.email || "");
      checkStripeCustomer();
    }
  }, [session, authLoading, navigate]);

  const checkStripeCustomer = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      setHasStripeCustomer(!error && (!!data?.url || data?.hasCustomer === true));
    } catch {
      setHasStripeCustomer(false);
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail
      });

      if (error) throw error;

      toast.success("Confirmation email sent! Check your inbox to verify the change.");
      setNewEmail("");
    } catch (error: any) {
      toast.error(error.message || "Failed to update email");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast.success("Password updated successfully!");
      setNewPassword("");
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");

      if (error || data?.error) {
        const errorMsg = error?.message || data?.error || "";
        if (errorMsg.includes("No Stripe customer") || data?.hasCustomer === false) {
          toast.error("No payment history found. Purchase a media kit first.");
          return;
        }
        throw new Error(errorMsg || "Unable to open billing portal");
      }

      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      if (data?.hasCustomer === false) {
        toast.error("No payment history found. Purchase a media kit first.");
        return;
      }

      throw new Error("Unexpected response from billing portal");
    } catch (error: any) {
      toast.error(error.message || "Failed to open billing portal");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmed) return;

    setLoading(true);
    try {
      // Delete all user's media kits first
      const { error: deleteKitsError } = await supabase
        .from('media_kits')
        .delete()
        .eq('user_id', session?.user?.id);

      if (deleteKitsError) throw deleteKitsError;

      // Sign out and redirect
      await supabase.auth.signOut();
      toast.success("Account deleted successfully");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <AuthHeader showSettings showUpgrade />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage your account settings</p>
          </div>

          {/* Account Information */}
          <Card className="p-6 shadow-card">
            <h2 className="text-2xl font-bold mb-4">Account Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="currentEmail">Current Email</Label>
                <Input
                  id="currentEmail"
                  type="email"
                  value={email}
                  disabled
                  className="bg-muted"
                />
              </div>
              <form onSubmit={handleUpdateEmail} className="space-y-4">
                <div>
                  <Label htmlFor="newEmail">New Email</Label>
                  <Input
                    id="newEmail"
                    type="email"
                    placeholder="Enter new email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    You'll receive a confirmation email at both addresses
                  </p>
                </div>
                <Button type="submit" disabled={loading || !newEmail}>
                  {loading ? "Updating..." : "Update Email"}
                </Button>
              </form>
            </div>
          </Card>

          {/* Billing & Payments */}
          <Card className="p-6 shadow-card">
            <h2 className="text-2xl font-bold mb-4">Billing & Payments</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Manage your subscription and billing
              </p>
              <div className="flex gap-3">
                <Button onClick={handleManageBilling} disabled={loading}>
                  {loading ? "Loading..." : "Manage Billing"}
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/upgrade">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Change Plan
                  </Link>
                </Button>
              </div>
            </div>
          </Card>

          {/* Change Password */}
          <Card className="p-6 shadow-card">
            <h2 className="text-2xl font-bold mb-4">Change Password</h2>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={6}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Must be at least 6 characters
                </p>
              </div>
              <Button type="submit" disabled={loading || !newPassword}>
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </Card>

          {/* Danger Zone */}
          <Card className="p-6 shadow-card border-destructive">
            <h2 className="text-2xl font-bold mb-4 text-destructive">Danger Zone</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Once you delete your account, there is no going back. This will permanently
                delete all your media kits and data.
              </p>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete Account"}
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Settings;

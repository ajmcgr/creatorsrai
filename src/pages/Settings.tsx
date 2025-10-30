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
  const [testEmail, setTestEmail] = useState("");
  const [testName, setTestName] = useState("Test User");
  const [sendingTest, setSendingTest] = useState(false);

  const PAYMENT_LINK = "https://buy.stripe.com/7sYeVfd7g1Zl8rod0rg3600";

  useEffect(() => {
    if (!authLoading && !session) {
      navigate("/auth");
    } else if (session?.user) {
      const userEmail = session.user.email || "";
      setEmail(userEmail);
      setTestEmail(userEmail);
    }
  }, [session, authLoading, navigate]);

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

  const handleSendTestEmail = async () => {
    if (!testEmail || !testEmail.includes("@")) {
      toast.error("Enter a valid email");
      return;
    }
    setSendingTest(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-test-email", {
        body: { name: testName || "Test User", email: testEmail },
      });
      if ((error as any)) throw error;
      toast.success("Test email sent! Check your inbox.");
    } catch (err: any) {
      console.error("[send-test-email] error", err);
      toast.error(err?.message || "Failed to send test email");
    } finally {
      setSendingTest(false);
    }
  };

  const handleManageBilling = () => {
    window.open("https://billing.stripe.com/p/login/7sYeVfd7g1Zl8rod0rg3600", "_blank");
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
                <Button onClick={handleManageBilling}>
                  Manage Billing
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

          {/* Email Test (Resend) */}
          <Card className="p-6 shadow-card">
            <h2 className="text-2xl font-bold mb-4">Email Test (Resend)</h2>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="testName">Name</Label>
                  <Input
                    id="testName"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="testEmail">Email</Label>
                  <Input
                    id="testEmail"
                    type="email"
                    placeholder="you@example.com"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={handleSendTestEmail} disabled={sendingTest || !testEmail}>
                {sendingTest ? "Sending..." : "Send Test Email"}
              </Button>
              <p className="text-sm text-muted-foreground">
                We'll send a simple confirmation to verify your Resend setup.
              </p>
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

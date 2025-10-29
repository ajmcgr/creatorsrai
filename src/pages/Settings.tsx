import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthHeader from "@/components/AuthHeader";

const Settings = () => {
  return (
    <div className="min-h-screen bg-background">
      <AuthHeader />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Settings</h1>

          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Settings configuration coming soon.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;

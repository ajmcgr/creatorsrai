import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Instagram, Youtube, Mail } from "lucide-react";

const PublicKit = () => {
  const { slug } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardContent className="p-12">
              <div className="text-center mb-8">
                <div className="w-32 h-32 rounded-full bg-muted mx-auto mb-6" />
                <h1 className="text-4xl font-bold mb-4">Media Kit</h1>
                <p className="text-xl text-muted-foreground">
                  Public media kit: {slug}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-muted rounded-lg">
                  <p className="text-3xl font-bold text-primary">100K</p>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>
                <div className="text-center p-6 bg-muted rounded-lg">
                  <p className="text-3xl font-bold text-primary">5.2%</p>
                  <p className="text-sm text-muted-foreground">Engagement</p>
                </div>
                <div className="text-center p-6 bg-muted rounded-lg">
                  <p className="text-3xl font-bold text-primary">25-34</p>
                  <p className="text-sm text-muted-foreground">Age Range</p>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <Button variant="outline" size="lg">
                  <Instagram className="h-5 w-5 mr-2" />
                  Instagram
                </Button>
                <Button variant="outline" size="lg">
                  <Youtube className="h-5 w-5 mr-2" />
                  YouTube
                </Button>
                <Button size="lg">
                  <Mail className="h-5 w-5 mr-2" />
                  Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PublicKit;

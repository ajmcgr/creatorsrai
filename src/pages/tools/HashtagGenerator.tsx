import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Hash, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const HashtagGenerator = () => {
  const { toast } = useToast();
  const [topic, setTopic] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);

  const generateHashtags = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;

    const generated = [
      `#${topic.toLowerCase()}`,
      `#${topic.toLowerCase()}creator`,
      `#${topic.toLowerCase()}content`,
      `#${topic.toLowerCase()}community`,
      `#${topic.toLowerCase()}vibes`,
      `#${topic.toLowerCase()}life`,
      `#${topic.toLowerCase()}daily`,
      `#trending${topic.toLowerCase()}`,
      `#viral${topic.toLowerCase()}`,
      `#${topic.toLowerCase()}inspiration`,
    ];
    setHashtags(generated);
  };

  const copyHashtags = () => {
    navigator.clipboard.writeText(hashtags.join(" "));
    toast({
      title: "Copied!",
      description: "Hashtags copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto">
          <Hash className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-center mb-4">Hashtag Generator</h1>
          <p className="text-center text-muted-foreground mb-12">
            Generate relevant hashtags for your content
          </p>

          <Card>
            <CardHeader>
              <CardTitle>Generate Hashtags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={generateHashtags} className="space-y-4">
                <div>
                  <Label htmlFor="topic">Topic or Niche</Label>
                  <Input
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., fashion, fitness, travel"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Generate Hashtags</Button>
              </form>

              {hashtags.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Generated Hashtags</h3>
                    <Button variant="outline" size="sm" onClick={copyHashtags}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy All
                    </Button>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm">{hashtags.join(" ")}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HashtagGenerator;

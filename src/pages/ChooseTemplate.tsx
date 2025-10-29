import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AuthHeader from "@/components/AuthHeader";
import { Layout, Sparkles, Palette } from "lucide-react";

const templates = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean and contemporary design",
    icon: Layout,
  },
  {
    id: "creative",
    name: "Creative",
    description: "Bold and artistic layout",
    icon: Sparkles,
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple and elegant",
    icon: Palette,
  },
];

const ChooseTemplate = () => {
  const navigate = useNavigate();

  const handleSelectTemplate = (templateId: string) => {
    navigate(`/create-media-kit?template=${templateId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <AuthHeader />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Choose a Template</h1>
          <p className="text-muted-foreground mb-12">
            Select a template to get started with your media kit
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {templates.map((template) => {
              const Icon = template.icon;
              return (
                <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleSelectTemplate(template.id)}>
                  <CardHeader>
                    <Icon className="h-12 w-12 text-primary mb-4" />
                    <CardTitle>{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">Select Template</Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseTemplate;

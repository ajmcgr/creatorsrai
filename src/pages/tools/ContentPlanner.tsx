import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";

const ContentPlanner = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <Calendar className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-center mb-4">Content Planner</h1>
          <p className="text-center text-muted-foreground mb-12">
            Plan and schedule your content across all platforms
          </p>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Content Calendar</CardTitle>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule Post
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-lg p-8 text-center">
                    <p className="text-muted-foreground">Calendar view coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">No scheduled posts</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Post Ideas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Save your content ideas here</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContentPlanner;

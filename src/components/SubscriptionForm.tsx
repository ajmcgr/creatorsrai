import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mail, CheckCircle2 } from 'lucide-react';

export function SubscriptionForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/subscribe`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({ email }),
        }
      );

      const result = await response.json();

      if (result.ok) {
        setIsSubscribed(true);
        setEmail('');
        toast({
          title: "Successfully subscribed!",
          description: "You'll receive weekly updates about new creators.",
        });
      } else {
        throw new Error(result.error || 'Subscription failed');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Subscription failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <Card className="p-6 bg-green-50 border-green-200">
        <div className="flex items-center space-x-3">
          <CheckCircle2 className="h-6 w-6 text-green-600" />
          <div>
            <h3 className="text-lg font-semibold text-green-900">
              You're subscribed!
            </h3>
            <p className="text-sm text-green-700">
              You'll receive weekly updates about new creators entering the ranking.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Mail className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Subscribe to Updates</h3>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Be the first to know about new creators and updated metrics from the ranking.
          Get weekly emails highlighting newcomers to the Top 200.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="email" className="sr-only">
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="w-full"
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-auto px-6 bg-[#ff8642] text-white hover:bg-[#e67538] disabled:bg-[#ff8642]/50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Subscribing...' : 'Subscribe to Weekly Updates'}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground">
          We respect your privacy. No spam, unsubscribe anytime.
        </p>
      </div>
    </Card>
  );
}
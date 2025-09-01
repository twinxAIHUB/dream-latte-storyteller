import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, Star, Download, RefreshCw, Mail } from "lucide-react";

interface Feedback {
  id: string;
  name: string;
  email: string;
  message: string;
  rating: number | null;
  created_at: string;
}

const FeedbackList = () => {
  const { toast } = useToast();
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFeedback(data || []);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      toast({
        title: "Error",
        description: "Failed to load feedback data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (rating: number | null) => {
    if (!rating) return <span className="text-muted-foreground">No rating</span>;
    
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium">{rating}/5</span>
      </div>
    );
  };

  const getRatingBadge = (rating: number | null) => {
    if (!rating) return <Badge variant="outline">No Rating</Badge>;
    
    if (rating >= 4) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (rating >= 3) return <Badge className="bg-blue-100 text-blue-800">Good</Badge>;
    if (rating >= 2) return <Badge className="bg-yellow-100 text-yellow-800">Fair</Badge>;
    return <Badge variant="destructive">Poor</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Rating', 'Message', 'Date'];
    const csvContent = [
      headers.join(','),
      ...feedback.map(f => [
        `"${f.name}"`,
        `"${f.email}"`,
        `"${f.rating || 'No rating'}"`,
        `"${f.message.replace(/"/g, '""')}"`,
        `"${formatDate(f.created_at)}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedback-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-coffee/20">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-6 h-6 text-coffee-brown" />
            <div>
              <CardTitle className="text-coffee-brown">Customer Feedback</CardTitle>
              <CardDescription>
                View and manage all customer feedback and ratings
              </CardDescription>
            </div>
          </div>
          <div className="flex space-x-2">
              <Button
                onClick={fetchFeedback}
                variant="outline"
                size="sm"
                disabled={isLoading}
                className="border-coffee/30"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            <Button
              onClick={exportToCSV}
              variant="outline"
              size="sm"
              className="border-coffee/30"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading feedback...
          </div>
        ) : feedback.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No feedback received yet
          </div>
        ) : (
          <div className="space-y-4">
            {feedback.map((item) => (
              <Card key={item.id} className="bg-white/40 border-coffee/10">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h4 className="font-semibold text-coffee-brown">{item.name}</h4>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          <span>{item.email}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {getRatingBadge(item.rating)}
                      <div className="mt-1 text-xs text-muted-foreground">
                        {formatDate(item.created_at)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    {renderStars(item.rating)}
                  </div>
                  
                  <div className="p-3 bg-white/60 rounded-lg border border-coffee/10">
                    <p className="text-sm leading-relaxed">{item.message}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FeedbackList;
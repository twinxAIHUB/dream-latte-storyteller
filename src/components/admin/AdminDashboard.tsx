import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  MessageSquare, 
  Eye, 
  Coffee, 
  LogOut, 
  Calendar,
  Clock,
  DollarSign,
  FileText,
  BarChart3
} from "lucide-react";
import CoffeeTastingEditor from "./CoffeeTastingEditor";
import ParticipantsList from "./ParticipantsList";
import VisitorStats from "./VisitorStats";
import FeedbackList from "./FeedbackList";
import TermsEditor from "./TermsEditor";

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalVisitors: 0,
    totalParticipants: 0,
    totalFeedback: 0,
    todayVisitors: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch visitor count
      const { count: visitorCount } = await supabase
        .from('website_visitors')
        .select('*', { count: 'exact', head: true });

      // Fetch today's visitors
      const today = new Date().toISOString().split('T')[0];
      const { count: todayCount } = await supabase
        .from('website_visitors')
        .select('*', { count: 'exact', head: true })
        .gte('visit_timestamp', `${today}T00:00:00.000Z`)
        .lt('visit_timestamp', `${today}T23:59:59.999Z`);

      // Fetch participants count
      const { count: participantCount } = await supabase
        .from('coffee_tasting_registrations')
        .select('*', { count: 'exact', head: true });

      // Fetch feedback count
      const { count: feedbackCount } = await supabase
        .from('feedback')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalVisitors: visitorCount || 0,
        totalParticipants: participantCount || 0,
        totalFeedback: feedbackCount || 0,
        todayVisitors: todayCount || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-cream to-cream">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-coffee/20 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Coffee className="w-8 h-8 text-coffee-brown" />
            <h1 className="text-2xl font-bold text-coffee-brown">Admin Dashboard</h1>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="border-coffee/30 text-coffee-brown hover:bg-coffee/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/60 backdrop-blur-sm border-coffee/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
              <Eye className="h-4 w-4 text-coffee-brown" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-coffee-brown">{stats.totalVisitors}</div>
              <p className="text-xs text-muted-foreground">
                {stats.todayVisitors} today
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-coffee/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Event Participants</CardTitle>
              <Users className="h-4 w-4 text-coffee-brown" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-coffee-brown">{stats.totalParticipants}</div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-coffee/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Feedback Received</CardTitle>
              <MessageSquare className="h-4 w-4 text-coffee-brown" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-coffee-brown">{stats.totalFeedback}</div>
              <p className="text-xs text-muted-foreground">Customer feedback</p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-coffee/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <BarChart3 className="h-4 w-4 text-coffee-brown" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-coffee-brown">Active</div>
              <p className="text-xs text-muted-foreground">System operational</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="participants" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/60 backdrop-blur-sm">
            <TabsTrigger value="participants" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Participants
            </TabsTrigger>
            <TabsTrigger value="visitors" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Visitors
            </TabsTrigger>
            <TabsTrigger value="feedback" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Feedback
            </TabsTrigger>
            <TabsTrigger value="event-editor" className="flex items-center gap-2">
              <Coffee className="w-4 h-4" />
              Event Editor
            </TabsTrigger>
            <TabsTrigger value="terms" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Terms
            </TabsTrigger>
          </TabsList>

          <TabsContent value="participants">
            <ParticipantsList />
          </TabsContent>

          <TabsContent value="visitors">
            <VisitorStats />
          </TabsContent>

          <TabsContent value="feedback">
            <FeedbackList />
          </TabsContent>

          <TabsContent value="event-editor">
            <CoffeeTastingEditor />
          </TabsContent>

          <TabsContent value="terms">
            <TermsEditor />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
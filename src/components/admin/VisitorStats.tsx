import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Eye, Globe, Clock, Download, RefreshCw } from "lucide-react";

interface Visitor {
  id: string;
  ip_address: string | null;
  user_agent: string | null;
  page_visited: string;
  visit_timestamp: string;
  session_id: string | null;
  referrer: string | null;
}

interface PageStats {
  page: string;
  visits: number;
  percentage: number;
}

const VisitorStats = () => {
  const { toast } = useToast();
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [pageStats, setPageStats] = useState<PageStats[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchVisitorData();
  }, []);

  const fetchVisitorData = async () => {
    setIsLoading(true);
    try {
      // Fetch recent visitors
      const { data: visitorsData, error: visitorsError } = await supabase
        .from('website_visitors')
        .select('*')
        .order('visit_timestamp', { ascending: false })
        .limit(50);

      if (visitorsError) throw visitorsError;

      // Fetch page statistics
      const { data: allVisitors, error: statsError } = await supabase
        .from('website_visitors')
        .select('page_visited');

      if (statsError) throw statsError;

      setVisitors(visitorsData || []);

      // Calculate page statistics
      const pageCounts: Record<string, number> = {};
      allVisitors?.forEach((visitor) => {
        pageCounts[visitor.page_visited] = (pageCounts[visitor.page_visited] || 0) + 1;
      });

      const totalVisits = allVisitors?.length || 0;
      const stats = Object.entries(pageCounts)
        .map(([page, visits]) => ({
          page,
          visits,
          percentage: totalVisits > 0 ? Math.round((visits / totalVisits) * 100) : 0
        }))
        .sort((a, b) => b.visits - a.visits);

      setPageStats(stats);
    } catch (error) {
      console.error('Error fetching visitor data:', error);
      toast({
        title: "Error",
        description: "Failed to load visitor data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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

  const getBrowserFromUserAgent = (userAgent: string | null) => {
    if (!userAgent) return 'Unknown';
    
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Other';
  };

  const exportToCSV = () => {
    const headers = ['IP Address', 'Page Visited', 'Browser', 'Visit Time', 'Referrer'];
    const csvContent = [
      headers.join(','),
      ...visitors.map(v => [
        `"${v.ip_address || 'N/A'}"`,
        `"${v.page_visited}"`,
        `"${getBrowserFromUserAgent(v.user_agent)}"`,
        `"${formatDate(v.visit_timestamp)}"`,
        `"${v.referrer || 'Direct'}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visitor-stats-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Page Statistics */}
      <Card className="bg-white/60 backdrop-blur-sm border-coffee/20">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Globe className="w-6 h-6 text-coffee-brown" />
            <div>
              <CardTitle className="text-coffee-brown">Page Statistics</CardTitle>
              <CardDescription>Most visited pages on your website</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pageStats.map((stat, index) => (
              <div key={stat.page} className="flex items-center justify-between p-4 bg-white/40 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="text-xs">
                    #{index + 1}
                  </Badge>
                  <span className="font-medium">{stat.page}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-muted-foreground">{stat.visits} visits</span>
                  <Badge variant="secondary">{stat.percentage}%</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Visitors */}
      <Card className="bg-white/60 backdrop-blur-sm border-coffee/20">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <Eye className="w-6 h-6 text-coffee-brown" />
              <div>
                <CardTitle className="text-coffee-brown">Recent Visitors</CardTitle>
                <CardDescription>Latest 50 website visitors</CardDescription>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={fetchVisitorData}
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
              Loading visitor data...
            </div>
          ) : visitors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No visitor data available
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Page Visited</TableHead>
                    <TableHead>Browser</TableHead>
                    <TableHead>Visit Time</TableHead>
                    <TableHead>Referrer</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visitors.map((visitor) => (
                    <TableRow key={visitor.id}>
                      <TableCell className="font-mono text-sm">
                        {visitor.ip_address || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{visitor.page_visited}</Badge>
                      </TableCell>
                      <TableCell>
                        {getBrowserFromUserAgent(visitor.user_agent)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(visitor.visit_timestamp)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {visitor.referrer ? (
                          <span className="text-blue-600 underline">{visitor.referrer}</span>
                        ) : (
                          <span className="text-muted-foreground">Direct</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VisitorStats;
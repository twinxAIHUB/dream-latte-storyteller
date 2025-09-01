import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Users, Mail, Phone, Star, Download, RefreshCw, Trash2, Eye } from "lucide-react";

interface Participant {
  id: string;
  name: string;
  email: string;
  phone: string;
  experience: string;
  payment_screenshot_url: string | null;
  created_at: string;
}

const ParticipantsList = () => {
  const { toast } = useToast();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('coffee_tasting_registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setParticipants(data || []);
    } catch (error) {
      console.error('Error fetching participants:', error);
      toast({
        title: "Error",
        description: "Failed to load participants data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getExperienceBadge = (experience: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      "enthusiast": "default",
      "homebrewer": "secondary",
      "shop-owner": "destructive",
      "barista": "outline",
      "beginner": "secondary",
      "other": "outline"
    };

    return (
      <Badge variant={variants[experience] || "outline"}>
        {experience.charAt(0).toUpperCase() + experience.slice(1).replace('-', ' ')}
      </Badge>
    );
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
    const headers = ['Name', 'Email', 'Phone', 'Experience', 'Registration Date'];
    const csvContent = [
      headers.join(','),
      ...participants.map(p => [
        `"${p.name}"`,
        `"${p.email}"`,
        `"${p.phone}"`,
        `"${p.experience}"`,
        `"${formatDate(p.created_at)}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coffee-tasting-participants-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const deleteParticipant = async (participantId: string, participantName: string) => {
    if (!confirm(`Are you sure you want to delete ${participantName}'s registration? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('coffee_tasting_registrations')
        .delete()
        .eq('id', participantId);

      if (error) throw error;

      toast({
        title: "Participant Deleted",
        description: `${participantName}'s registration has been removed successfully.`,
      });

      // Refresh the list
      fetchParticipants();
    } catch (error) {
      console.error('Error deleting participant:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete participant. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-coffee/20">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-coffee-brown" />
            <div>
              <CardTitle className="text-coffee-brown">Event Participants</CardTitle>
              <CardDescription>
                Manage and view all coffee tasting session registrations
              </CardDescription>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={fetchParticipants}
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
            Loading participants...
          </div>
        ) : participants.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No participants registered yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participants.map((participant) => (
                  <TableRow key={participant.id}>
                    <TableCell className="font-medium">{participant.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{participant.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{participant.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getExperienceBadge(participant.experience)}
                    </TableCell>
                    <TableCell>
                      {participant.payment_screenshot_url ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Badge 
                              variant="default" 
                              className="bg-green-100 text-green-800 cursor-pointer hover:bg-green-200 transition-colors"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              Paid
                            </Badge>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Payment Verification - {participant.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="text-sm text-muted-foreground">
                                <p><strong>Email:</strong> {participant.email}</p>
                                <p><strong>Phone:</strong> {participant.phone}</p>
                                <p><strong>Registration Date:</strong> {formatDate(participant.created_at)}</p>
                              </div>
                              <div className="border rounded-lg p-4 bg-gray-50">
                                <h4 className="font-semibold mb-2">Payment Screenshot:</h4>
                                <img
                                  src={participant.payment_screenshot_url}
                                  alt="Payment verification"
                                  className="max-w-full h-auto rounded border"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextElementSibling!.style.display = 'block';
                                  }}
                                />
                                <div className="hidden text-center py-8 text-muted-foreground">
                                  <p>Image could not be loaded</p>
                                  <p className="text-sm">URL: {participant.payment_screenshot_url}</p>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <Badge variant="outline" className="border-orange-300 text-orange-800">
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(participant.created_at)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteParticipant(participant.id, participant.name)}
                        className="border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ParticipantsList;
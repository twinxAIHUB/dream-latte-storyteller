import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Save, Coffee } from "lucide-react";

const configSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  event_date: z.string().min(1, "Event date is required"),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  max_participants: z.number().min(1, "Maximum participants must be at least 1"),
  min_participants: z.number().min(1, "Minimum participants must be at least 1"),
  price_per_person: z.number().min(0, "Price must be positive"),
  down_payment_percentage: z.number().min(0).max(100, "Percentage must be between 0-100"),
  featured_coffees: z.string().optional(),
  additional_info: z.string().optional(),
});

type ConfigData = z.infer<typeof configSchema>;

const CoffeeTastingEditor = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [configId, setConfigId] = useState<string | null>(null);

  const form = useForm<ConfigData>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      title: "",
      description: "",
      event_date: "",
      start_time: "",
      end_time: "",
      max_participants: 6,
      min_participants: 4,
      price_per_person: 1000,
      down_payment_percentage: 50,
      featured_coffees: "",
      additional_info: "",
    },
  });

  useEffect(() => {
    fetchCurrentConfig();
  }, []);

  const fetchCurrentConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('coffee_tasting_config')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setConfigId(data.id);
        form.reset({
          title: data.title,
          description: data.description,
          event_date: data.event_date,
          start_time: data.start_time,
          end_time: data.end_time,
          max_participants: data.max_participants,
          min_participants: data.min_participants,
          price_per_person: Number(data.price_per_person),
          down_payment_percentage: data.down_payment_percentage,
          featured_coffees: data.featured_coffees || "",
          additional_info: data.additional_info || "",
        });
      }
    } catch (error) {
      console.error('Error fetching config:', error);
      toast({
        title: "Error",
        description: "Failed to load current configuration",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: ConfigData) => {
    setIsLoading(true);
    
    try {
      if (configId) {
        // Update existing config
        const { error } = await supabase
          .from('coffee_tasting_config')
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq('id', configId);

        if (error) throw error;
      } else {
        // Create new config
        const { data: newConfig, error } = await supabase
          .from('coffee_tasting_config')
          .insert([data])
          .select()
          .single();

        if (error) throw error;
        setConfigId(newConfig.id);
      }

      toast({
        title: "Configuration Saved",
        description: "Coffee tasting event configuration has been updated successfully",
      });
    } catch (error) {
      console.error('Error saving config:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save configuration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-coffee/20">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Coffee className="w-6 h-6 text-coffee-brown" />
          <div>
            <CardTitle className="text-coffee-brown">Coffee Tasting Event Editor</CardTitle>
            <CardDescription>
              Edit the coffee tasting session details and configuration
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Coffee Tasting Session" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="event_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Date</FormLabel>
                    <FormControl>
                      <Input placeholder="September 2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input placeholder="10:00 AM" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input placeholder="12:00 PM" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="min_participants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Participants</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_participants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Participants</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price_per_person"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price per Person (₱)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="down_payment_percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Down Payment Percentage</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Join us for an exclusive coffee tasting experience"
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="featured_coffees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Featured Coffees</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Premium coffees from our curated collection"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additional_info"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Information</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="50% down payment required to secure your spot."
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-gradient-coffee hover:opacity-90 text-primary-foreground"
              disabled={isLoading}
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Saving..." : "Save Configuration"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CoffeeTastingEditor;
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
import { Save, Coffee, RefreshCw } from "lucide-react";

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
  const [isDirty, setIsDirty] = useState(false);

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

  // Watch for form changes
  const watchedValues = form.watch();
  useEffect(() => {
    setIsDirty(form.formState.isDirty);
  }, [watchedValues, form.formState.isDirty]);

  useEffect(() => {
    fetchCurrentConfig();
  }, []);

  const fetchCurrentConfig = async () => {
    try {
      console.log('Fetching current config...');
      
      // First try to get the most recent config (active or not)
      const { data, error } = await supabase
        .from('coffee_tasting_config')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      console.log('Fetch result:', { data, error });

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
        
        console.log('Form reset with data:', data);
      } else {
        console.log('No existing config found, will create new one');
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
      console.log('Submitting config data:', data);
      
      // First, deactivate all existing configs
      console.log('Deactivating all existing configs...');
      const { error: deactivateError } = await supabase
        .from('coffee_tasting_config')
        .update({ is_active: false })
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all records

      if (deactivateError) {
        console.error('Error deactivating configs:', deactivateError);
        throw deactivateError;
      }
      
      if (configId) {
        // Update existing config
        console.log('Updating existing config with ID:', configId);
        const { data: updateData, error } = await supabase
          .from('coffee_tasting_config')
          .update({
            ...data,
            is_active: true,
            updated_at: new Date().toISOString(),
          })
          .eq('id', configId)
          .select();

        console.log('Update result:', { updateData, error });

        if (error) throw error;
        
        // Update the form with the saved data instead of refetching
        if (updateData && updateData.length > 0) {
          const savedData = updateData[0];
          form.reset({
            title: savedData.title,
            description: savedData.description,
            event_date: savedData.event_date,
            start_time: savedData.start_time,
            end_time: savedData.end_time,
            max_participants: savedData.max_participants,
            min_participants: savedData.min_participants,
            price_per_person: Number(savedData.price_per_person),
            down_payment_percentage: savedData.down_payment_percentage,
            featured_coffees: savedData.featured_coffees || "",
            additional_info: savedData.additional_info || "",
          });
          console.log('Form updated with saved data:', savedData);
        }
      } else {
        // Create new config
        console.log('Creating new config');
        const { data: newConfig, error } = await supabase
          .from('coffee_tasting_config')
          .insert([{
            ...data,
            is_active: true,
            updated_at: new Date().toISOString(),
          }])
          .select()
          .single();

        console.log('Create result:', { newConfig, error });

        if (error) throw error;
        setConfigId(newConfig.id);
        
        // Update the form with the new data
        form.reset({
          title: newConfig.title,
          description: newConfig.description,
          event_date: newConfig.event_date,
          start_time: newConfig.start_time,
          end_time: newConfig.end_time,
          max_participants: newConfig.max_participants,
          min_participants: newConfig.min_participants,
          price_per_person: Number(newConfig.price_per_person),
          down_payment_percentage: newConfig.down_payment_percentage,
          featured_coffees: newConfig.featured_coffees || "",
          additional_info: newConfig.additional_info || "",
        });
        console.log('Form updated with new data:', newConfig);
      }

      toast({
        title: "Configuration Saved",
        description: "Coffee tasting event configuration has been updated successfully",
      });
      
    } catch (error) {
      console.error('Error saving config:', error);
      toast({
        title: "Save Failed",
        description: `Failed to save configuration: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-coffee/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Coffee className="w-6 h-6 text-coffee-brown" />
            <div>
              <CardTitle className="text-coffee-brown">Coffee Tasting Event Editor</CardTitle>
              <CardDescription>
                Edit the coffee tasting session details and configuration
              </CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchCurrentConfig}
            disabled={isLoading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
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
              {isLoading ? "Saving..." : isDirty ? "Save Changes" : "Configuration Saved"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CoffeeTastingEditor;
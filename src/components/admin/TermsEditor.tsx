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
import { FileText, Save, Eye } from "lucide-react";

const termsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  version: z.string().min(1, "Version is required"),
});

type TermsData = z.infer<typeof termsSchema>;

const TermsEditor = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [termsId, setTermsId] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);

  const form = useForm<TermsData>({
    resolver: zodResolver(termsSchema),
    defaultValues: {
      title: "",
      content: "",
      version: "1.0",
    },
  });

  useEffect(() => {
    fetchCurrentTerms();
  }, []);

  const fetchCurrentTerms = async () => {
    try {
      const { data, error } = await supabase
        .from('terms_agreements')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setTermsId(data.id);
        form.reset({
          title: data.title,
          content: data.content,
          version: data.version,
        });
      }
    } catch (error) {
      console.error('Error fetching terms:', error);
      toast({
        title: "Error",
        description: "Failed to load current terms and agreements",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: TermsData) => {
    setIsLoading(true);
    
    try {
      if (termsId) {
        // Deactivate current terms
        await supabase
          .from('terms_agreements')
          .update({ is_active: false })
          .eq('id', termsId);

        // Create new version
        const { data: newTerms, error } = await supabase
          .from('terms_agreements')
          .insert([{
            title: data.title,
            content: data.content,
            version: data.version,
            is_active: true,
          }])
          .select()
          .single();

        if (error) throw error;
        setTermsId(newTerms.id);
      } else {
        // Create new terms
        const { data: newTerms, error } = await supabase
          .from('terms_agreements')
          .insert([{
            title: data.title,
            content: data.content,
            version: data.version,
            is_active: true,
          }])
          .select()
          .single();

        if (error) throw error;
        setTermsId(newTerms.id);
      }

      toast({
        title: "Terms Updated",
        description: "Terms and agreements have been updated successfully",
      });
    } catch (error) {
      console.error('Error saving terms:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save terms and agreements. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const watchedContent = form.watch('content');

  return (
    <div className="space-y-6">
      <Card className="bg-white/60 backdrop-blur-sm border-coffee/20">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-coffee-brown" />
              <div>
                <CardTitle className="text-coffee-brown">Terms and Agreements Editor</CardTitle>
                <CardDescription>
                  Edit the data collection and privacy policy terms
                </CardDescription>
              </div>
            </div>
            <Button
              onClick={() => setIsPreview(!isPreview)}
              variant="outline"
              className="border-coffee/30"
            >
              <Eye className="w-4 h-4 mr-2" />
              {isPreview ? 'Edit' : 'Preview'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isPreview ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-coffee-brown mb-2">
                  {form.getValues('title')}
                </h3>
                <div className="text-sm text-muted-foreground mb-4">
                  Version: {form.getValues('version')}
                </div>
              </div>
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {watchedContent}
                </div>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Data Collection and Privacy Policy" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="version"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Version</FormLabel>
                        <FormControl>
                          <Input placeholder="1.0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter the terms and agreements content..."
                          className="min-h-[400px] font-mono text-sm"
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
                  {isLoading ? "Saving..." : "Save Terms & Agreements"}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsEditor;
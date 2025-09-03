import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Upload, Coffee, Calendar, Clock, Users, QrCode } from "lucide-react";
import qrCodeImage from "@/assets/qr.png";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  experience: z.string().min(1, "Please select your coffee experience level"),
  paymentScreenshot: z.instanceof(File).optional(),
  agreeToTerms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the Terms to continue" })
  }),
});

type FormData = z.infer<typeof formSchema>;

const EventForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [termsContent, setTermsContent] = useState<string>("");
  const [termsTitle, setTermsTitle] = useState<string>("Terms & Agreement");
  const [eventConfig, setEventConfig] = useState<any>(null);

  // Track page visit
  useEffect(() => {
    const trackVisit = async () => {
      try {
        await supabase
          .from('website_visitors')
          .insert({
            page_visited: '/coffee-tasting',
            session_id: sessionStorage.getItem('sessionId') || `session-${Date.now()}`,
            user_agent: navigator.userAgent,
            referrer: document.referrer,
          });
      } catch (error) {
        console.error('Failed to track visit:', error);
      }
    };
    
    trackVisit();
  }, []);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      experience: "",
      agreeToTerms: false,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("paymentScreenshot", file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      let paymentScreenshotUrl = null;
      
      // Upload payment screenshot to Supabase storage if file exists
      if (data.paymentScreenshot) {
        try {
          const fileExt = data.paymentScreenshot.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          
          // Use the correct bucket name from Supabase dashboard
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('payment-screenshots')
            .upload(fileName, data.paymentScreenshot, {
              cacheControl: '3600',
              upsert: false
            });
          
          if (uploadError) {
            throw new Error(`Upload failed: ${uploadError.message}`);
          }
          
          // Get the public URL for the uploaded file
          const { data: urlData } = supabase.storage
            .from('payment-screenshots')
            .getPublicUrl(fileName);
          
          paymentScreenshotUrl = urlData.publicUrl;
          
          console.log('File uploaded successfully:', urlData.publicUrl);
        } catch (uploadError) {
          console.error('File upload error:', uploadError);
          toast({
            title: "File Upload Failed",
            description: "Registration will continue without file upload.",
            variant: "destructive",
          });
        }
      }
      
      // Insert registration data into Supabase
      const { data: registrationData, error: insertError } = await supabase
        .from('coffee_tasting_registrations')
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone,
          experience: data.experience,
          payment_screenshot_url: paymentScreenshotUrl,
        });
      
      if (insertError) {
        throw new Error(`Registration failed: ${insertError.message}`);
      }
      
      toast({
        title: "Registration Successful!",
        description: "We'll send you a confirmation email shortly with event details.",
      });
      
      form.reset();
      setPreviewUrl(null);
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load latest active terms
  useEffect(() => {
    const loadTerms = async () => {
      try {
        const { data, error } = await supabase
          .from('terms_agreements')
          .select('title, content')
          .eq('is_active', true)
          .order('updated_at', { ascending: false })
          .limit(1);

        if (error) throw error;
        if (data && data.length > 0) {
          setTermsTitle(data[0].title || 'Terms & Agreement');
          setTermsContent(data[0].content || '');
        }
      } catch (err) {
        console.error('Failed to load terms:', err);
      }
    };
    loadTerms();
  }, []);

  // Load event configuration
  useEffect(() => {
    const loadEventConfig = async () => {
      try {
        console.log('Loading event config from database...');
        
        // Get the first record (should be the only one now)
        const { data, error } = await supabase
          .from('coffee_tasting_config')
          .select('*')
          .limit(1)
          .maybeSingle();

        console.log('Config result:', { data, error });

        if (error) throw error;
        if (data) {
          console.log('Setting event config:', data);
          setEventConfig(data);
        } else {
          console.log('No event config found in database');
        }
      } catch (err) {
        console.error('Failed to load event config:', err);
      }
    };
    loadEventConfig();
  }, []);

  return (
    <div 
      className="min-h-screen relative py-12 px-4"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(75, 46, 46, 0.8)), url(/lovable-uploads/1700ddfd-610f-4aad-bd19-4fa2fa00b29f.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-2xl mx-auto relative z-10">
        {/* Event Details Header */}
        <Card className="mb-8 border-coffee/20 bg-background/95 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Coffee className="w-12 h-12 text-coffee" />
            </div>
            <CardTitle className="text-3xl font-bold text-coffee mb-2">
              {eventConfig?.title || "Coffee Tasting Session"}
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              {eventConfig?.description || "Join us for an exclusive coffee tasting experience"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-coffee" />
                <div>
                  <p className="font-semibold">Date</p>
                  <p className="text-muted-foreground">{eventConfig?.event_date || "September 2024"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-coffee" />
                <div>
                  <p className="font-semibold">Time</p>
                  <p className="text-muted-foreground">{eventConfig?.start_time || "10:00 AM"} - {eventConfig?.end_time || "12:00 PM"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-coffee" />
                <div>
                  <p className="font-semibold">Capacity</p>
                  <p className="text-muted-foreground">{eventConfig?.min_participants || "4"}-{eventConfig?.max_participants || "6"} participants max</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="w-5 h-5 text-coffee text-lg font-bold flex items-center justify-center">₱</span>
                <div>
                  <p className="font-semibold">Price</p>
                  <p className="text-muted-foreground">₱{eventConfig?.price_per_person || "1,000"} per person</p>
                </div>
              </div>
            </div>
            <div className="mt-6 p-6 bg-gradient-to-r from-coffee/20 to-coffee-light/20 rounded-lg border border-coffee/30">
              <p className="text-sm text-center font-medium">
                {eventConfig?.featured_coffees || "Experience premium coffees from our curated collection."}
                <br />
                <span className="text-coffee font-semibold">{eventConfig?.additional_info || "50% down payment required to secure your spot."}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Registration Form */}
        <Card className="border-coffee/20 bg-background/95 backdrop-blur-sm shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-coffee">Register Now</CardTitle>
            <CardDescription>
              Fill out the form below to reserve your spot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coffee Experience Level *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your experience level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="enthusiast">Coffee Enthusiast</SelectItem>
                          <SelectItem value="homebrewer">Home Brewer</SelectItem>
                          <SelectItem value="shop-owner">Coffee Shop Owner</SelectItem>
                          <SelectItem value="barista">Professional Barista</SelectItem>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Payment Section */}
                <div className="space-y-4">
                  <FormLabel className="text-lg font-semibold text-coffee">Payment Instructions (50% Down Payment)</FormLabel>
                  
                  {/* QR Code Section */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border-2 border-blue-200">
                    <div className="text-center mb-4">
                      <QrCode className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <h3 className="text-lg font-bold text-blue-800 mb-2">GCash Payment</h3>
                      <p className="text-sm text-blue-700 mb-4">
                        Scan the QR code below to pay ₱{eventConfig ? (eventConfig.price_per_person * eventConfig.down_payment_percentage / 100) : 500}.00 via GCash
                      </p>
                    </div>
                    
                    <div className="flex justify-center">
                      <div className="bg-white p-8 rounded-lg shadow-lg">
                        <img
                          src={qrCodeImage}
                          alt="GCash QR Code"
                          className="w-96 h-96 md:w-[512px] md:h-[512px] object-contain"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Upload Section */}
                  <FormField
                    control={form.control}
                    name="paymentScreenshot"
                    render={() => (
                      <FormItem>
                        <FormLabel>Upload Payment Screenshot (Optional)</FormLabel>
                        <FormControl>
                          <div className="border-2 border-dashed border-coffee/30 rounded-lg p-8 text-center hover:border-coffee/50 transition-all duration-300 hover:bg-coffee/5">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                              id="payment-upload"
                            />
                            <label htmlFor="payment-upload" className="cursor-pointer">
                              <Upload className="w-8 h-8 text-coffee mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground mb-1">
                                Upload your payment screenshot (optional)
                              </p>
                              <p className="text-xs text-muted-foreground">
                                JPG, PNG up to 5MB
                              </p>
                            </label>
                            {previewUrl && (
                              <div className="mt-4">
                                <img
                                  src={previewUrl}
                                  alt="Payment screenshot"
                                  className="max-w-full h-32 object-cover mx-auto rounded"
                                />
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Terms & Agreement */}
                <FormField
                  control={form.control}
                  name="agreeToTerms"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <div className="flex items-start space-x-3">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-normal">
                            I agree to the
                            <Dialog>
                              <DialogTrigger asChild>
                                <button type="button" className="ml-1 underline text-coffee hover:text-coffee-dark">
                                  Terms and Agreement
                                </button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>{termsTitle}</DialogTitle>
                                </DialogHeader>
                                <div className="prose max-w-none whitespace-pre-wrap text-sm">
                                  {termsContent || 'No terms available at the moment.'}
                                </div>
                              </DialogContent>
                            </Dialog>
                          </FormLabel>
                          <p className="text-xs text-muted-foreground">You must agree before submitting.</p>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-coffee hover:opacity-90 text-primary-foreground py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Register for Coffee Tasting Session"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventForm;
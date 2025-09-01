import { useState } from "react";
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

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  experience: z.string().min(1, "Please select your coffee experience level"),
  paymentScreenshot: z.instanceof(File).refine(
    (file) => file.size <= 5000000,
    "File size must be less than 5MB"
  ),
});

type FormData = z.infer<typeof formSchema>;

const EventForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      experience: "",
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
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Registration Successful!",
        description: "We'll send you a confirmation email shortly with event details.",
      });
      
      form.reset();
      setPreviewUrl(null);
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Coffee Tasting Session
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Join us for an exclusive coffee tasting experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-coffee" />
                <div>
                  <p className="font-semibold">Date</p>
                  <p className="text-muted-foreground">September 2024</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-coffee" />
                <div>
                  <p className="font-semibold">Time</p>
                  <p className="text-muted-foreground">10:00 AM - 12:00 PM</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-coffee" />
                <div>
                  <p className="font-semibold">Capacity</p>
                  <p className="text-muted-foreground">4-6 participants max</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="w-5 h-5 text-coffee text-lg font-bold flex items-center justify-center">₱</span>
                <div>
                  <p className="font-semibold">Price</p>
                  <p className="text-muted-foreground">₱1,000 per person</p>
                </div>
              </div>
            </div>
            <div className="mt-6 p-6 bg-gradient-to-r from-coffee/20 to-coffee-light/20 rounded-lg border border-coffee/30">
              <p className="text-sm text-center font-medium">
                Experience premium coffees from our curated collection. 
                <br />
                <span className="text-coffee font-semibold">50% down payment required to secure your spot.</span>
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
                        Scan the QR code below to pay ₱500.00 via GCash
                      </p>
                    </div>
                    
                    <div className="flex justify-center">
                      <div className="bg-white p-6 rounded-lg shadow-lg">
                        <img
                          src={qrCodeImage}
                          alt="GCash QR Code"
                          className="w-64 h-64 object-contain"
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
                        <FormLabel>Upload Payment Screenshot *</FormLabel>
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
                                Upload your payment screenshot
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
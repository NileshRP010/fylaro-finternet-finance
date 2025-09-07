import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Headphones,
  Building,
  Globe,
} from "lucide-react";

const Contact = () => {
  const navigate = useNavigate();

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Get in touch via email",
      value: "hello@fylaro.com",
      action: "mailto:hello@fylaro.com",
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak with our team",
      value: "+1 (555) 123-4567",
      action: "tel:+15551234567",
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Chat with support",
      value: "Available 24/7",
      action: "#",
    },
    {
      icon: Headphones,
      title: "Support Center",
      description: "Browse help articles",
      value: "help.fylaro.com",
      action: () => navigate("/help"),
    },
  ];

  const offices = [
    {
      city: "San Francisco",
      address: "123 Market Street, Suite 456",
      phone: "+1 (415) 555-0123",
      timezone: "PST",
    },
    {
      city: "New York",
      address: "456 Wall Street, Floor 12",
      phone: "+1 (212) 555-0456",
      timezone: "EST",
    },
    {
      city: "London",
      address: "789 Canary Wharf, Level 25",
      phone: "+44 20 7123 4567",
      timezone: "GMT",
    },
  ];

  const departments = [
    { name: "General Inquiry", email: "hello@fylaro.com" },
    { name: "Sales", email: "sales@fylaro.com" },
    { name: "Support", email: "support@fylaro.com" },
    { name: "Partnerships", email: "partners@fylaro.com" },
    { name: "Press", email: "press@fylaro.com" },
    { name: "Legal", email: "legal@fylaro.com" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="secondary" className="mb-4">
            Contact Us
          </Badge>
          <h1 className="text-4xl font-bold">Get in Touch</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions about our platform? Want to discuss partnership
            opportunities? We'd love to hear from you.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactMethods.map((method, index) => (
            <Card
              key={index}
              className="gradient-card border-border cursor-pointer hover:border-primary/50 transition-colors"
            >
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <method.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{method.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {method.description}
                  </p>
                  <p className="text-sm font-medium text-primary">
                    {method.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="gradient-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Send className="h-5 w-5 mr-2" />
                Send us a Message
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="Enter your first name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Enter your last name" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company (Optional)</Label>
                <Input id="company" placeholder="Enter your company name" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="How can we help you?" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us more about your inquiry..."
                  rows={5}
                />
              </div>

              <Button className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Offices */}
            <Card className="gradient-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Our Offices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {offices.map((office, index) => (
                  <div key={index} className="p-4 bg-muted/20 rounded-lg">
                    <h3 className="font-semibold flex items-center mb-2">
                      <MapPin className="h-4 w-4 mr-2" />
                      {office.city}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      {office.address}
                    </p>
                    <p className="text-sm text-muted-foreground mb-1">
                      {office.phone}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {office.timezone}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Department Contacts */}
            <Card className="gradient-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Department Contacts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {departments.map((dept, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-muted/20 rounded-lg"
                  >
                    <span className="font-medium">{dept.name}</span>
                    <a
                      href={`mailto:${dept.email}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {dept.email}
                    </a>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card className="gradient-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="text-muted-foreground">
                    9:00 AM - 6:00 PM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="text-muted-foreground">
                    10:00 AM - 4:00 PM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-muted-foreground">Closed</span>
                </div>
                <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                  <p className="text-sm text-primary font-medium">
                    <Globe className="h-4 w-4 inline mr-2" />
                    24/7 Platform Support Available
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Reference */}
        <Card className="gradient-card border-border">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <MessageSquare className="h-12 w-12 mx-auto text-primary" />
              <h3 className="text-xl font-semibold">
                Looking for Quick Answers?
              </h3>
              <p className="text-muted-foreground">
                Check out our comprehensive help center and FAQ section for
                immediate assistance.
              </p>
              <Button variant="outline" onClick={() => navigate("/help")}>
                Visit Help Center
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Contact;

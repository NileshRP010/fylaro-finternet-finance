import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Target,
  Award,
  Globe,
  ArrowRight,
  Building,
  Calendar,
  Mail,
} from "lucide-react";

const About = () => {
  const navigate = useNavigate();

  const teamMembers = [
    {
      name: "Alex Chen",
      role: "CEO & Co-Founder",
      bio: "Former Goldman Sachs VP with 15+ years in fintech innovation",
      image: "/placeholder-avatar-1.jpg",
    },
    {
      name: "Sarah Johnson",
      role: "CTO & Co-Founder",
      bio: "Ex-Microsoft architect specializing in blockchain infrastructure",
      image: "/placeholder-avatar-2.jpg",
    },
    {
      name: "David Rodriguez",
      role: "Head of Product",
      bio: "Former Stripe product manager with expertise in financial platforms",
      image: "/placeholder-avatar-3.jpg",
    },
  ];

  const milestones = [
    { year: "2023", event: "Fylaro founded with $5M seed funding" },
    {
      year: "2024",
      event: "Platform launch and first $10M in invoice financing",
    },
    { year: "2024", event: "Finternet integration and global expansion" },
    { year: "2025", event: "100+ enterprise clients and $500M+ processed" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="secondary" className="mb-4">
            About Fylaro
          </Badge>
          <h1 className="text-4xl font-bold">
            Revolutionizing Invoice Financing
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're building the future of working capital financing through
            blockchain technology, connecting businesses with global investors
            in a transparent, efficient marketplace.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="gradient-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To democratize access to working capital by creating a
                transparent, efficient, and global marketplace for invoice
                financing powered by blockchain technology and Finternet
                principles.
              </p>
            </CardContent>
          </Card>

          <Card className="gradient-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                A world where any business can access instant liquidity for
                their invoices, and investors can participate in a diverse,
                transparent portfolio of real-world assets.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Company Stats */}
        <Card className="gradient-card border-border">
          <CardHeader>
            <CardTitle>By the Numbers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">$500M+</div>
                <div className="text-sm text-muted-foreground">
                  Invoices Processed
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">100+</div>
                <div className="text-sm text-muted-foreground">
                  Enterprise Clients
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">
                  Countries Served
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">99.8%</div>
                <div className="text-sm text-muted-foreground">
                  Platform Uptime
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Our Journey
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 bg-muted/20 rounded-lg"
                >
                  <Badge variant="outline">{milestone.year}</Badge>
                  <p className="text-sm">{milestone.event}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team */}
        <Card className="gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Leadership Team
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {teamMembers.map((member, index) => (
                <div key={index} className="text-center space-y-3">
                  <div className="w-24 h-24 bg-muted rounded-full mx-auto flex items-center justify-center">
                    <Users className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-primary">{member.role}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {member.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact CTA */}
        <Card className="gradient-card border-border">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Building className="h-12 w-12 mx-auto text-primary" />
              <h3 className="text-xl font-semibold">Want to Learn More?</h3>
              <p className="text-muted-foreground">
                Get in touch with our team to discuss partnership opportunities
                or learn more about our platform.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate("/contact")}>
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Us
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/marketplace")}
                >
                  Explore Platform
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default About;

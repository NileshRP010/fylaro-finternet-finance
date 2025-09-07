import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Code,
  Globe,
  Heart,
  Users,
  TrendingUp,
  ArrowRight,
  MapPin,
  Clock,
} from "lucide-react";

const Careers = () => {
  const navigate = useNavigate();

  const openPositions = [
    {
      title: "Senior Full-Stack Developer",
      department: "Engineering",
      location: "Remote / San Francisco",
      type: "Full-time",
      description: "Build and scale our invoice tokenization platform",
    },
    {
      title: "Product Manager - Fintech",
      department: "Product",
      location: "New York / Remote",
      type: "Full-time",
      description: "Drive product strategy for our financial marketplace",
    },
    {
      title: "Senior Smart Contract Developer",
      department: "Blockchain",
      location: "Remote",
      type: "Full-time",
      description: "Develop and audit secure smart contracts for DeFi",
    },
    {
      title: "Head of Business Development",
      department: "Sales",
      location: "London / Remote",
      type: "Full-time",
      description: "Lead enterprise partnerships and client acquisition",
    },
    {
      title: "Security Engineer",
      department: "Security",
      location: "Remote",
      type: "Full-time",
      description: "Ensure platform security and compliance",
    },
    {
      title: "UI/UX Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
      description: "Design intuitive financial interfaces",
    },
  ];

  const benefits = [
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health insurance and wellness programs",
    },
    {
      icon: Globe,
      title: "Remote-First",
      description: "Work from anywhere with flexible hours",
    },
    {
      icon: TrendingUp,
      title: "Equity Package",
      description: "Competitive equity and token incentives",
    },
    {
      icon: Users,
      title: "Learning & Growth",
      description: "Professional development and conference budget",
    },
  ];

  const departments = [
    { name: "Engineering", openings: 3, icon: Code },
    { name: "Product", openings: 1, icon: Briefcase },
    { name: "Design", openings: 1, icon: Heart },
    { name: "Business", openings: 2, icon: TrendingUp },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="secondary" className="mb-4">
            Join Our Team
          </Badge>
          <h1 className="text-4xl font-bold">Build the Future of Finance</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join Fylaro and help create the infrastructure that will power the
            next generation of global financial services.
          </p>
        </div>

        {/* Why Fylaro */}
        <Card className="gradient-card border-border">
          <CardHeader>
            <CardTitle>Why Work at Fylaro?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Departments Overview */}
        <Card className="gradient-card border-border">
          <CardHeader>
            <CardTitle>Open Positions by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              {departments.map((dept, index) => (
                <div
                  key={index}
                  className="p-4 bg-muted/20 rounded-lg text-center"
                >
                  <dept.icon className="h-8 w-8 mx-auto text-primary mb-2" />
                  <h3 className="font-semibold">{dept.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {dept.openings} open position
                    {dept.openings !== 1 ? "s" : ""}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Open Positions */}
        <Card className="gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Briefcase className="h-5 w-5 mr-2" />
              Current Openings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {openPositions.map((position, index) => (
                <div key={index} className="p-6 bg-muted/20 rounded-lg">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">
                        {position.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {position.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{position.department}</Badge>
                        <Badge variant="outline" className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {position.location}
                        </Badge>
                        <Badge variant="outline" className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {position.type}
                        </Badge>
                      </div>
                    </div>
                    <Button className="shrink-0">
                      Apply Now
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Application Process */}
        <Card className="gradient-card border-border">
          <CardHeader>
            <CardTitle>Our Hiring Process</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center space-y-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mx-auto text-primary-foreground font-bold">
                  1
                </div>
                <h3 className="font-semibold">Application</h3>
                <p className="text-sm text-muted-foreground">
                  Submit your resume and portfolio
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mx-auto text-primary-foreground font-bold">
                  2
                </div>
                <h3 className="font-semibold">Screen</h3>
                <p className="text-sm text-muted-foreground">
                  Initial call with our team
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mx-auto text-primary-foreground font-bold">
                  3
                </div>
                <h3 className="font-semibold">Interview</h3>
                <p className="text-sm text-muted-foreground">
                  Technical and culture fit interviews
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mx-auto text-primary-foreground font-bold">
                  4
                </div>
                <h3 className="font-semibold">Offer</h3>
                <p className="text-sm text-muted-foreground">
                  Welcome to the team!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="gradient-card border-border">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Users className="h-12 w-12 mx-auto text-primary" />
              <h3 className="text-xl font-semibold">Don't See Your Role?</h3>
              <p className="text-muted-foreground">
                We're always looking for exceptional talent. Send us your resume
                and we'll keep you in mind for future opportunities.
              </p>
              <Button onClick={() => navigate("/contact")}>
                Send Resume
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Careers;

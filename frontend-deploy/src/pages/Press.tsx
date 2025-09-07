import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Newspaper,
  Calendar,
  ExternalLink,
  Download,
  Award,
  TrendingUp,
  Users,
  Globe,
  Mic,
  Camera,
} from "lucide-react";

const Press = () => {
  const navigate = useNavigate();

  const pressReleases = [
    {
      title:
        "Fylaro Raises $25M Series A to Expand Global Invoice Financing Platform",
      date: "March 20, 2024",
      excerpt:
        "Leading fintech company secures funding to accelerate international growth and enhance blockchain-based financial services.",
      category: "Funding",
    },
    {
      title: "Fylaro Launches Finternet Integration for Cross-Border Payments",
      date: "February 15, 2024",
      excerpt:
        "Revolutionary new feature enables seamless international invoice financing with reduced costs and faster settlement times.",
      category: "Product",
    },
    {
      title: "Fylaro Processes $500M in Invoice Financing Milestone",
      date: "January 30, 2024",
      excerpt:
        "Platform celebrates major achievement as small and medium businesses increasingly adopt blockchain-based financing solutions.",
      category: "Milestone",
    },
    {
      title:
        "Fylaro Partners with Major European Banks for Invoice Tokenization",
      date: "December 12, 2023",
      excerpt:
        "Strategic partnerships expand access to traditional banking infrastructure while maintaining blockchain innovation.",
      category: "Partnership",
    },
  ];

  const mediaKit = [
    {
      title: "Company Logo Pack",
      description: "High-resolution logos in various formats",
      type: "ZIP File",
      size: "2.3 MB",
    },
    {
      title: "Product Screenshots",
      description: "Platform interface and feature screenshots",
      type: "ZIP File",
      size: "15.7 MB",
    },
    {
      title: "Executive Headshots",
      description: "Professional photos of leadership team",
      type: "ZIP File",
      size: "8.2 MB",
    },
    {
      title: "Company Fact Sheet",
      description: "Key statistics and company information",
      type: "PDF",
      size: "1.1 MB",
    },
  ];

  const awards = [
    {
      title: "Best Fintech Innovation 2024",
      organization: "Global Fintech Awards",
      date: "March 2024",
    },
    {
      title: "Top Blockchain Company",
      organization: "Tech Innovation Summit",
      date: "February 2024",
    },
    {
      title: "SME Finance Solution of the Year",
      organization: "Financial Services Forum",
      date: "December 2023",
    },
  ];

  const mediaContacts = [
    {
      name: "Sarah Mitchell",
      role: "Head of Communications",
      email: "press@fylaro.com",
      phone: "+1 (555) 123-4567",
    },
    {
      name: "David Chen",
      role: "PR Manager",
      email: "media@fylaro.com",
      phone: "+1 (555) 123-4568",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="secondary" className="mb-4">
            Press & Media
          </Badge>
          <h1 className="text-4xl font-bold">Press Center</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Latest news, press releases, and media resources for journalists and
            industry analysts covering Fylaro.
          </p>
        </div>

        {/* Latest News */}
        <Card className="gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Newspaper className="h-5 w-5 mr-2" />
              Latest Press Releases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {pressReleases.map((release, index) => (
                <div key={index} className="p-6 bg-muted/20 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">
                        {release.title}
                      </h3>
                      <p className="text-muted-foreground mb-3">
                        {release.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {release.date}
                        </div>
                        <Badge variant="outline">{release.category}</Badge>
                      </div>
                    </div>
                    <div className="ml-4 flex gap-2 shrink-0">
                      <Button size="sm" variant="outline">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Read More
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3 mr-1" />
                        PDF
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Company Stats */}
        <Card className="gradient-card border-border">
          <CardHeader>
            <CardTitle>Company at a Glance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  $500M+
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Volume Processed
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">100+</div>
                <div className="text-sm text-muted-foreground">
                  Enterprise Clients
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">50+</div>
                <div className="text-sm text-muted-foreground">
                  Countries Served
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">2021</div>
                <div className="text-sm text-muted-foreground">Founded</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Awards & Recognition */}
          <Card className="gradient-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Awards & Recognition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {awards.map((award, index) => (
                  <div key={index} className="p-4 bg-muted/20 rounded-lg">
                    <h3 className="font-semibold">{award.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {award.organization}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {award.date}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Media Contacts */}
          <Card className="gradient-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Media Contacts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mediaContacts.map((contact, index) => (
                  <div key={index} className="p-4 bg-muted/20 rounded-lg">
                    <h3 className="font-semibold">{contact.name}</h3>
                    <p className="text-sm text-primary mb-2">{contact.role}</p>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>{contact.email}</p>
                      <p>{contact.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Media Kit */}
        <Card className="gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Camera className="h-5 w-5 mr-2" />
              Media Kit & Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {mediaKit.map((item, index) => (
                <div
                  key={index}
                  className="p-4 bg-muted/20 rounded-lg flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.type} • {item.size}
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Press Inquiry */}
        <Card className="gradient-card border-border">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Mic className="h-12 w-12 mx-auto text-primary" />
              <h3 className="text-xl font-semibold">Media Inquiries</h3>
              <p className="text-muted-foreground">
                For press inquiries, interview requests, or additional
                information, please contact our media team.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate("/contact")}>
                  Contact Press Team
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Media Kit
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                press@fylaro.com • Response within 24 hours
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Press;

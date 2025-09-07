import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  HelpCircle,
  Search,
  Book,
  MessageSquare,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  FileText,
  Users,
  Lightbulb,
  AlertTriangle,
} from "lucide-react";

const HelpCenter = () => {
  const navigate = useNavigate();

  const popularTopics = [
    {
      title: "How to tokenize an invoice",
      category: "Getting Started",
      views: "12,450",
      difficulty: "Beginner",
    },
    {
      title: "Setting up cross-border payments",
      category: "Payments",
      views: "8,920",
      difficulty: "Intermediate",
    },
    {
      title: "Understanding risk assessment scores",
      category: "Risk Management",
      views: "7,650",
      difficulty: "Beginner",
    },
    {
      title: "API integration troubleshooting",
      category: "Technical",
      views: "6,340",
      difficulty: "Advanced",
    },
    {
      title: "Marketplace trading basics",
      category: "Trading",
      views: "5,890",
      difficulty: "Beginner",
    },
    {
      title: "Wallet security best practices",
      category: "Security",
      views: "4,720",
      difficulty: "Intermediate",
    },
  ];

  const categories = [
    {
      title: "Getting Started",
      description: "Basic guides to help you begin",
      icon: Book,
      articles: 24,
      color: "text-blue-500",
    },
    {
      title: "Account Management",
      description: "Managing your Fylaro account",
      icon: Users,
      articles: 18,
      color: "text-green-500",
    },
    {
      title: "Invoice Financing",
      description: "How to finance and trade invoices",
      icon: FileText,
      articles: 32,
      color: "text-purple-500",
    },
    {
      title: "Payments & Settlements",
      description: "Cross-border payment solutions",
      icon: Clock,
      articles: 21,
      color: "text-orange-500",
    },
    {
      title: "API & Integrations",
      description: "Technical documentation and guides",
      icon: ExternalLink,
      articles: 45,
      color: "text-red-500",
    },
    {
      title: "Troubleshooting",
      description: "Common issues and solutions",
      icon: AlertTriangle,
      articles: 15,
      color: "text-yellow-500",
    },
  ];

  const supportOptions = [
    {
      title: "Live Chat",
      description: "Get instant help from our support team",
      availability: "24/7 Available",
      responseTime: "< 2 minutes",
      icon: MessageSquare,
      action: "Start Chat",
    },
    {
      title: "Phone Support",
      description: "Speak directly with our experts",
      availability: "Mon-Fri 9AM-6PM EST",
      responseTime: "Immediate",
      icon: Phone,
      action: "Call Now",
    },
    {
      title: "Email Support",
      description: "Detailed support via email",
      availability: "24/7 Available",
      responseTime: "< 4 hours",
      icon: Mail,
      action: "Send Email",
    },
  ];

  const quickActions = [
    "Reset Password",
    "Update Payment Method",
    "Download Invoice",
    "API Key Management",
    "Account Verification",
    "Transaction History",
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="secondary" className="mb-4">
            Support & Help
          </Badge>
          <h1 className="text-4xl font-bold">Help Center</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Find answers to your questions, learn how to use Fylaro's features,
            and get support when you need it.
          </p>
        </div>

        {/* Search */}
        <Card className="gradient-card border-border">
          <CardContent className="pt-6">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search for help articles, guides, and FAQs..."
                className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2">
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Popular Topics */}
        <Card className="gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="h-5 w-5 mr-2" />
              Popular Help Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {popularTopics.map((topic, index) => (
                <div
                  key={index}
                  className="p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{topic.title}</h3>
                    <Badge variant="outline" className="text-xs">
                      {topic.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{topic.category}</span>
                    <span>{topic.views} views</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Help Categories */}
        <Card className="gradient-card border-border">
          <CardHeader>
            <CardTitle>Browse by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <div
                    key={index}
                    className="p-6 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center mb-3">
                      <IconComponent
                        className={`h-6 w-6 mr-3 ${category.color}`}
                      />
                      <h3 className="font-semibold">{category.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {category.description}
                    </p>
                    <div className="text-xs text-muted-foreground">
                      {category.articles} articles
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="gradient-card border-border">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <p className="text-muted-foreground">
              Common tasks you can do right now
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start h-auto p-4"
                >
                  <span className="text-left">{action}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Support Options */}
        <Card className="gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <HelpCircle className="h-5 w-5 mr-2" />
              Contact Support
            </CardTitle>
            <p className="text-muted-foreground">
              Can't find what you're looking for? Our support team is here to
              help.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {supportOptions.map((option, index) => {
                const IconComponent = option.icon;
                return (
                  <div
                    key={index}
                    className="p-6 bg-muted/20 rounded-lg text-center"
                  >
                    <IconComponent className="h-8 w-8 mx-auto mb-4 text-primary" />
                    <h3 className="font-semibold mb-2">{option.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {option.description}
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="text-xs text-muted-foreground">
                        <strong>Availability:</strong> {option.availability}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <strong>Response:</strong> {option.responseTime}
                      </div>
                    </div>
                    <Button className="w-full">{option.action}</Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Status & Community */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="gradient-card border-border">
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Platform Status</span>
                  <Badge className="bg-green-500">Operational</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>API Services</span>
                  <Badge className="bg-green-500">Operational</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Payment Processing</span>
                  <Badge className="bg-green-500">Operational</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Blockchain Network</span>
                  <Badge className="bg-green-500">Operational</Badge>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Status Page
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-border">
            <CardHeader>
              <CardTitle>Community</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted/20 rounded-lg">
                  <h3 className="font-semibold mb-2">Developer Forum</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Join our community of developers and get help with
                    integrations.
                  </p>
                  <Button size="sm" variant="outline">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Visit Forum
                  </Button>
                </div>
                <div className="p-4 bg-muted/20 rounded-lg">
                  <h3 className="font-semibold mb-2">Knowledge Base</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Comprehensive guides and documentation for all features.
                  </p>
                  <Button size="sm" variant="outline">
                    <Book className="h-3 w-3 mr-1" />
                    Browse Articles
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Contact */}
        <Card className="gradient-card border-border border-orange-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertTriangle className="h-12 w-12 mx-auto text-orange-500" />
              <h3 className="text-xl font-semibold">Emergency Support</h3>
              <p className="text-muted-foreground">
                For urgent issues affecting your business operations, contact
                our emergency support line.
              </p>
              <div className="flex gap-4 justify-center">
                <Button variant="destructive">
                  <Phone className="h-4 w-4 mr-2" />
                  Emergency Hotline
                </Button>
                <Button variant="outline" onClick={() => navigate("/contact")}>
                  Contact Form
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Emergency: +1 (555) 911-HELP • Available 24/7 for critical
                issues
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default HelpCenter;

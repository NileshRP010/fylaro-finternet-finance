import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Code,
  Key,
  Globe,
  Server,
  Webhook,
  Book,
  Download,
  ExternalLink,
  Copy,
  Settings,
  Shield,
  Zap,
  Database,
} from "lucide-react";

const ApiDocs = () => {
  const { toast } = useToast();

  const showComingSoon = () => {
    toast({
      title: "Coming Soon",
      description:
        "This feature will be available soon. Stay tuned for updates!",
    });
  };

  const endpoints = [
    {
      method: "POST",
      path: "/api/v1/invoices/tokenize",
      description: "Tokenize an invoice for trading",
      auth: "Bearer Token",
    },
    {
      method: "GET",
      path: "/api/v1/marketplace/listings",
      description: "Get available invoice listings",
      auth: "API Key",
    },
    {
      method: "POST",
      path: "/api/v1/financing/apply",
      description: "Apply for invoice financing",
      auth: "Bearer Token",
    },
    {
      method: "GET",
      path: "/api/v1/wallet/balance",
      description: "Get wallet balance and holdings",
      auth: "Bearer Token",
    },
    {
      method: "POST",
      path: "/api/v1/settlements/initiate",
      description: "Initiate cross-border settlement",
      auth: "Bearer Token",
    },
  ];

  const sdks = [
    {
      name: "JavaScript SDK",
      description: "Official JavaScript/Node.js SDK",
      version: "v2.1.0",
      language: "JavaScript",
    },
    {
      name: "Python SDK",
      description: "Official Python SDK",
      version: "v2.0.5",
      language: "Python",
    },
    {
      name: "Go SDK",
      description: "Official Go SDK",
      version: "v1.8.2",
      language: "Go",
    },
    {
      name: "Java SDK",
      description: "Official Java SDK",
      version: "v1.7.0",
      language: "Java",
    },
  ];

  const webhooks = [
    {
      event: "invoice.tokenized",
      description: "Triggered when an invoice is successfully tokenized",
    },
    {
      event: "payment.received",
      description: "Triggered when a payment is received",
    },
    {
      event: "settlement.completed",
      description: "Triggered when cross-border settlement completes",
    },
    {
      event: "financing.approved",
      description: "Triggered when financing application is approved",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="secondary" className="mb-4">
            Developer Resources
          </Badge>
          <h1 className="text-4xl font-bold">API Documentation</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Complete API reference, SDKs, and integration guides for developers
            building with Fylaro's financial infrastructure.
          </p>
        </div>

        {/* Quick Start */}
        <Card className="gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              Quick Start
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-muted/20 rounded-lg">
                <Key className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">1. Get API Keys</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Register and obtain your API credentials
                </p>
                <Button size="sm" variant="outline" onClick={showComingSoon}>
                  Get Started
                </Button>
              </div>
              <div className="text-center p-6 bg-muted/20 rounded-lg">
                <Code className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">2. Install SDK</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Choose your preferred language SDK
                </p>
                <Button size="sm" variant="outline" onClick={showComingSoon}>
                  Browse SDKs
                </Button>
              </div>
              <div className="text-center p-6 bg-muted/20 rounded-lg">
                <Globe className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">3. Make API Call</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start integrating with our endpoints
                </p>
                <Button size="sm" variant="outline" onClick={showComingSoon}>
                  View Examples
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Documentation Tabs */}
        <Tabs defaultValue="endpoints" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="sdks">SDKs</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="guides">Guides</TabsTrigger>
          </TabsList>

          <TabsContent value="endpoints" className="space-y-4">
            <Card className="gradient-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Server className="h-5 w-5 mr-2" />
                  API Endpoints
                </CardTitle>
                <p className="text-muted-foreground">
                  Base URL:{" "}
                  <code className="bg-muted px-2 py-1 rounded">
                    https://api.fylaro.com
                  </code>
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {endpoints.map((endpoint, index) => (
                    <div key={index} className="p-4 bg-muted/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Badge
                            variant={
                              endpoint.method === "GET"
                                ? "secondary"
                                : "default"
                            }
                            className="font-mono"
                          >
                            {endpoint.method}
                          </Badge>
                          <code className="text-sm">{endpoint.path}</code>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={showComingSoon}
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={showComingSoon}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Try It
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {endpoint.description}
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Shield className="h-3 w-3 mr-1" />
                        {endpoint.auth}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sdks" className="space-y-4">
            <Card className="gradient-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="h-5 w-5 mr-2" />
                  Official SDKs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {sdks.map((sdk, index) => (
                    <div key={index} className="p-4 bg-muted/20 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">{sdk.name}</h3>
                        <Badge variant="outline">{sdk.version}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {sdk.description}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={showComingSoon}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Install
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={showComingSoon}
                        >
                          <Book className="h-3 w-3 mr-1" />
                          Docs
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={showComingSoon}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          GitHub
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="webhooks" className="space-y-4">
            <Card className="gradient-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Webhook className="h-5 w-5 mr-2" />
                  Webhooks
                </CardTitle>
                <p className="text-muted-foreground">
                  Real-time notifications for important events in your
                  application.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {webhooks.map((webhook, index) => (
                    <div key={index} className="p-4 bg-muted/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                          {webhook.event}
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={showComingSoon}
                        >
                          <Settings className="h-3 w-3 mr-1" />
                          Configure
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {webhook.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guides" className="space-y-4">
            <Card className="gradient-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Book className="h-5 w-5 mr-2" />
                  Integration Guides
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/20 rounded-lg">
                    <h3 className="font-semibold mb-2">Invoice Tokenization</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Complete guide to tokenizing invoices on the blockchain
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={showComingSoon}
                    >
                      <Book className="h-3 w-3 mr-1" />
                      Read Guide
                    </Button>
                  </div>
                  <div className="p-4 bg-muted/20 rounded-lg">
                    <h3 className="font-semibold mb-2">Payment Integration</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Accept payments and handle settlements
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={showComingSoon}
                    >
                      <Book className="h-3 w-3 mr-1" />
                      Read Guide
                    </Button>
                  </div>
                  <div className="p-4 bg-muted/20 rounded-lg">
                    <h3 className="font-semibold mb-2">Marketplace API</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Build custom marketplace interfaces
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={showComingSoon}
                    >
                      <Book className="h-3 w-3 mr-1" />
                      Read Guide
                    </Button>
                  </div>
                  <div className="p-4 bg-muted/20 rounded-lg">
                    <h3 className="font-semibold mb-2">Webhook Setup</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Configure real-time event notifications
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={showComingSoon}
                    >
                      <Book className="h-3 w-3 mr-1" />
                      Read Guide
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* API Status */}
        <Card className="gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              API Status & Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500 mb-1">
                  99.9%
                </div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  120ms
                </div>
                <div className="text-sm text-muted-foreground">
                  Avg Response
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">50M+</div>
                <div className="text-sm text-muted-foreground">
                  API Calls/Month
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500 mb-1">
                  Operational
                </div>
                <div className="text-sm text-muted-foreground">Status</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Developer Support */}
        <Card className="gradient-card border-border">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Book className="h-12 w-12 mx-auto text-primary" />
              <h3 className="text-xl font-semibold">Need Help?</h3>
              <p className="text-muted-foreground">
                Our developer support team is here to help you integrate with
                Fylaro's APIs.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={showComingSoon}>Contact Support</Button>
                <Button variant="outline" onClick={showComingSoon}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Developer Forum
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                developers@fylaro.com • 24/7 support available
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ApiDocs;

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Scale,
  Shield,
  Eye,
  Download,
  ExternalLink,
  Calendar,
  AlertTriangle,
} from "lucide-react";

const Legal = () => {
  const navigate = useNavigate();

  const legalDocuments = [
    {
      title: "Terms of Service",
      description: "Platform usage terms and conditions",
      lastUpdated: "March 15, 2024",
      icon: FileText,
    },
    {
      title: "Privacy Policy",
      description: "How we collect, use, and protect your data",
      lastUpdated: "March 15, 2024",
      icon: Eye,
    },
    {
      title: "Risk Disclosure",
      description: "Investment risks and important disclosures",
      lastUpdated: "March 10, 2024",
      icon: AlertTriangle,
    },
    {
      title: "Compliance Framework",
      description: "Regulatory compliance and procedures",
      lastUpdated: "February 28, 2024",
      icon: Scale,
    },
  ];

  const keyTerms = [
    {
      title: "Eligible Users",
      content:
        "Platform access limited to verified businesses and accredited investors",
    },
    {
      title: "Invoice Requirements",
      content:
        "All invoices must be legitimate, verified, and from creditworthy debtors",
    },
    {
      title: "Investment Limits",
      content:
        "Minimum investment of $1,000, maximum varies by user verification level",
    },
    {
      title: "Fee Structure",
      content:
        "Platform fees range from 0.5% to 2.5% depending on transaction type",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="secondary" className="mb-4">
            Legal Information
          </Badge>
          <h1 className="text-4xl font-bold">Terms & Legal Documents</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Important legal information, terms of service, and compliance
            documentation for using the Fylaro platform.
          </p>
        </div>

        {/* Legal Documents */}
        <Card className="gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Legal Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {legalDocuments.map((doc, index) => (
                <div
                  key={index}
                  className="p-6 bg-muted/20 rounded-lg space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <doc.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{doc.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {doc.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      Updated: {doc.lastUpdated}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Terms Summary */}
        <Card className="gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Scale className="h-5 w-5 mr-2" />
              Key Terms Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {keyTerms.map((term, index) => (
                <div key={index} className="p-4 bg-muted/20 rounded-lg">
                  <h3 className="font-semibold mb-2">{term.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {term.content}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Regulatory Compliance */}
        <Card className="gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Regulatory Compliance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/20 rounded-lg">
              <h3 className="font-semibold mb-2">Financial Regulations</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Fylaro operates in compliance with applicable financial
                regulations including:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Securities regulations for investment platforms</li>
                <li>• Anti-money laundering (AML) requirements</li>
                <li>• Know Your Customer (KYC) procedures</li>
                <li>• Cross-border payment compliance</li>
              </ul>
            </div>
            <div className="p-4 bg-muted/20 rounded-lg">
              <h3 className="font-semibold mb-2">Data Protection</h3>
              <p className="text-sm text-muted-foreground mb-3">
                We comply with major data protection regulations:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• GDPR (General Data Protection Regulation)</li>
                <li>• CCPA (California Consumer Privacy Act)</li>
                <li>• SOC 2 Type II compliance</li>
                <li>• ISO 27001 information security standards</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Dispute Resolution */}
        <Card className="gradient-card border-border">
          <CardHeader>
            <CardTitle>Dispute Resolution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Fylaro provides multiple channels for dispute resolution:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/20 rounded-lg text-center">
                <h3 className="font-semibold mb-2">Customer Support</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  First-level support for platform issues
                </p>
                <Button size="sm" onClick={() => navigate("/help")}>
                  Contact Support
                </Button>
              </div>
              <div className="p-4 bg-muted/20 rounded-lg text-center">
                <h3 className="font-semibold mb-2">Mediation</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Independent mediation for complex disputes
                </p>
                <Button size="sm" variant="outline">
                  Request Mediation
                </Button>
              </div>
              <div className="p-4 bg-muted/20 rounded-lg text-center">
                <h3 className="font-semibold mb-2">Arbitration</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Binding arbitration for unresolved matters
                </p>
                <Button size="sm" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Legal Team */}
        <Card className="gradient-card border-border">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Scale className="h-12 w-12 mx-auto text-primary" />
              <h3 className="text-xl font-semibold">Legal Questions?</h3>
              <p className="text-muted-foreground">
                For legal inquiries, compliance questions, or document
                clarifications, contact our legal team.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate("/contact")}>
                  Contact Legal Team
                </Button>
                <Button variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Download All Documents
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                legal@fylaro.com • Available Monday-Friday, 9 AM - 6 PM EST
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Legal;

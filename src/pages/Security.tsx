import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Lock,
  Eye,
  FileText,
  Users,
  Database,
  AlertTriangle,
  CheckCircle,
  Globe,
  Server,
} from "lucide-react";

const Security = () => {
  const navigate = useNavigate();

  const securityFeatures = [
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description:
        "All data is encrypted using AES-256 encryption both in transit and at rest",
    },
    {
      icon: Shield,
      title: "Multi-Factor Authentication",
      description:
        "Secure your account with 2FA using authenticator apps or hardware keys",
    },
    {
      icon: Database,
      title: "Secure Data Storage",
      description:
        "Data stored in SOC 2 compliant data centers with regular security audits",
    },
    {
      icon: Server,
      title: "DDoS Protection",
      description: "Enterprise-grade DDoS protection and traffic filtering",
    },
    {
      icon: Eye,
      title: "Privacy by Design",
      description:
        "Built with privacy-first principles and minimal data collection",
    },
    {
      icon: CheckCircle,
      title: "Regular Audits",
      description: "Quarterly security audits by third-party security firms",
    },
  ];

  const certifications = [
    { name: "SOC 2 Type II", status: "Certified", date: "2024" },
    { name: "ISO 27001", status: "Certified", date: "2024" },
    { name: "PCI DSS", status: "Compliant", date: "2024" },
    { name: "GDPR", status: "Compliant", date: "2024" },
  ];

  const securityPractices = [
    "Zero-trust security architecture",
    "Regular penetration testing",
    "Automated vulnerability scanning",
    "Employee security training",
    "Incident response procedures",
    "24/7 security monitoring",
    "Secure development lifecycle",
    "Regular backup and disaster recovery testing",
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="secondary" className="mb-4">
            Security & Trust
          </Badge>
          <h1 className="text-4xl font-bold">Enterprise-Grade Security</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your financial data and transactions are protected by
            industry-leading security measures and compliance standards.
          </p>
        </div>

        {/* Security Features */}
        <Card className="gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Security Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {securityFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="p-4 bg-muted/20 rounded-lg space-y-3"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Compliance & Certifications */}
        <Card className="gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Compliance & Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className="p-4 bg-muted/20 rounded-lg text-center"
                >
                  <h3 className="font-semibold mb-2">{cert.name}</h3>
                  <Badge variant="secondary" className="mb-2">
                    {cert.status}
                  </Badge>
                  <p className="text-sm text-muted-foreground">{cert.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security Practices */}
        <Card className="gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="h-5 w-5 mr-2" />
              Security Practices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {securityPractices.map((practice, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                  <span className="text-sm">{practice}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data Protection */}
        <Card className="gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Data Protection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/20 rounded-lg">
              <h3 className="font-semibold mb-2">Encryption</h3>
              <p className="text-sm text-muted-foreground">
                All sensitive data is encrypted using AES-256 encryption. Data
                in transit is protected using TLS 1.3, and data at rest is
                encrypted using industry-standard encryption algorithms.
              </p>
            </div>
            <div className="p-4 bg-muted/20 rounded-lg">
              <h3 className="font-semibold mb-2">Access Control</h3>
              <p className="text-sm text-muted-foreground">
                We implement role-based access control (RBAC) with principle of
                least privilege. All access is logged and monitored for
                suspicious activity.
              </p>
            </div>
            <div className="p-4 bg-muted/20 rounded-lg">
              <h3 className="font-semibold mb-2">Data Retention</h3>
              <p className="text-sm text-muted-foreground">
                We retain data only as long as necessary for business purposes
                or as required by law. Data deletion procedures are regularly
                executed and audited.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Incident Response */}
        <Card className="gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Incident Response
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Our incident response team is available 24/7 to handle any
                security incidents. We have established procedures for:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Detection & Analysis</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Real-time threat monitoring</li>
                    <li>• Automated incident detection</li>
                    <li>• Security event correlation</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Response & Recovery</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Immediate threat containment</li>
                    <li>• Forensic investigation</li>
                    <li>• Service restoration procedures</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Security Team */}
        <Card className="gradient-card border-border">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Shield className="h-12 w-12 mx-auto text-primary" />
              <h3 className="text-xl font-semibold">Report a Security Issue</h3>
              <p className="text-muted-foreground">
                If you've discovered a security vulnerability, please report it
                to our security team immediately.
              </p>
              <div className="flex gap-4 justify-center">
                <Button>Report Vulnerability</Button>
                <Button variant="outline" onClick={() => navigate("/contact")}>
                  Contact Security Team
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                security@fylaro.com • We respond to security reports within 24
                hours
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Security;

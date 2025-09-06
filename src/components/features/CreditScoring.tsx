import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  Building2,
  DollarSign,
  BarChart3,
  Calendar,
  FileText,
  Phone,
  Mail,
  MapPin,
  Users,
  Award,
  Briefcase,
} from "lucide-react";

interface CreditScoringProps {
  companyId?: string;
  showDetails?: boolean;
}

const CreditScoring = ({
  companyId,
  showDetails = true,
}: CreditScoringProps) => {
  const [showFullReport, setShowFullReport] = useState(false);
  const [showScoreHistory, setShowScoreHistory] = useState(false);
  const [showCompanyProfile, setShowCompanyProfile] = useState(false);

  const creditData = {
    overallScore: 785,
    riskLevel: "Low",
    factors: [
      {
        category: "Payment History",
        score: 92,
        weight: 35,
        trend: "up",
        details: "100% on-time payments in last 12 months",
      },
      {
        category: "Financial Stability",
        score: 88,
        weight: 30,
        trend: "up",
        details: "Strong cash flow and revenue growth",
      },
      {
        category: "Business Age",
        score: 75,
        weight: 15,
        trend: "stable",
        details: "5+ years in business with consistent operations",
      },
      {
        category: "Industry Risk",
        score: 82,
        weight: 20,
        trend: "up",
        details: "Technology sector with moderate risk profile",
      },
    ],
    verificationStatus: {
      kyb: true,
      financials: true,
      references: true,
      legal: false,
    },
    recentActivity: [
      { date: "2024-02-28", action: "Payment completed", impact: "+2 points" },
      {
        date: "2024-02-25",
        action: "Financial statement verified",
        impact: "+5 points",
      },
      {
        date: "2024-02-20",
        action: "New invoice submitted",
        impact: "Neutral",
      },
    ],
  };

  const scoreHistory = [
    { date: "2024-02-01", score: 780, change: "+5" },
    { date: "2024-01-01", score: 775, change: "+12" },
    { date: "2023-12-01", score: 763, change: "-8" },
    { date: "2023-11-01", score: 771, change: "+15" },
    { date: "2023-10-01", score: 756, change: "+3" },
    { date: "2023-09-01", score: 753, change: "+7" },
  ];

  const companyProfile = {
    name: "TechFlow Solutions Inc.",
    registrationNumber: "REG123456789",
    founded: "2019",
    industry: "Software Development",
    employees: "150-200",
    revenue: "$5.2M annually",
    headquarters: "San Francisco, CA",
    website: "www.techflowsolutions.com",
    description:
      "Leading provider of enterprise software solutions specializing in workflow automation and business intelligence.",
    certifications: ["ISO 27001", "SOC 2 Type II", "GDPR Compliant"],
    keyPersonnel: [
      { name: "Sarah Johnson", role: "CEO", experience: "12 years" },
      { name: "Michael Chen", role: "CTO", experience: "15 years" },
      { name: "Emily Rodriguez", role: "CFO", experience: "8 years" },
    ],
    contactInfo: {
      email: "contact@techflowsolutions.com",
      phone: "+1 (555) 123-4567",
      address: "123 Innovation Drive, San Francisco, CA 94105",
    },
  };

  const fullReportData = {
    summary:
      "Comprehensive analysis shows strong creditworthiness with minimal risk indicators.",
    detailedScores: {
      "Payment Performance": {
        score: 92,
        trend: "Excellent",
        details: "100% on-time payments for 24 months",
      },
      "Financial Health": {
        score: 88,
        trend: "Strong",
        details: "Positive cash flow, growing revenue",
      },
      "Business Longevity": {
        score: 75,
        trend: "Good",
        details: "5+ years operational history",
      },
      "Market Position": {
        score: 82,
        trend: "Strong",
        details: "Established player in growing market",
      },
      "Legal Compliance": {
        score: 90,
        trend: "Excellent",
        details: "No outstanding legal issues",
      },
      References: {
        score: 85,
        trend: "Good",
        details: "Positive feedback from 12 business partners",
      },
    },
    recommendations: [
      "Consider increasing credit limit based on strong performance",
      "Monitor industry trends for potential impact",
      "Request updated financial statements quarterly",
    ],
    riskFactors: [
      "Market volatility in tech sector",
      "Dependency on key clients (40% revenue concentration)",
    ],
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 70) return "text-warning";
    return "text-destructive";
  };

  const getRiskBadge = (risk: string) => {
    const colors = {
      Low: "bg-success/10 text-success border-success/30",
      Medium: "bg-warning/10 text-warning border-warning/30",
      High: "bg-destructive/10 text-destructive border-destructive/30",
    };
    return colors[risk as keyof typeof colors] || "bg-muted";
  };

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card className="gradient-card border-border">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Credit Score</h3>
                <p className="text-muted-foreground">
                  AI-powered risk assessment
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-primary mb-2">
                {creditData.overallScore}
              </div>
              <Badge className={getRiskBadge(creditData.riskLevel)}>
                {creditData.riskLevel} Risk
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold mb-3">Score Breakdown</h4>
              {creditData.factors.map((factor) => (
                <div key={factor.category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      {factor.category}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`font-bold ${getScoreColor(factor.score)}`}
                      >
                        {factor.score}/100
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({factor.weight}% weight)
                      </span>
                    </div>
                  </div>
                  <Progress value={factor.score} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {factor.details}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold mb-3">Verification Status</h4>
              <div className="space-y-3">
                {Object.entries(creditData.verificationStatus).map(
                  ([key, verified]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm capitalize">
                        {key.toUpperCase()}
                      </span>
                      {verified ? (
                        <div className="flex items-center space-x-1 text-success">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-xs">Verified</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 text-warning">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="text-xs">Pending</span>
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {showDetails && (
        <>
          {/* Recent Activity */}
          <Card className="gradient-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Recent Score Changes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {creditData.recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-background/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <div>
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.date}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.impact}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="glow" onClick={() => setShowFullReport(true)}>
              <BarChart3 className="h-4 w-4 mr-2" />
              View Full Report
            </Button>
            <Button variant="outline" onClick={() => setShowScoreHistory(true)}>
              <TrendingUp className="h-4 w-4 mr-2" />
              Score History
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowCompanyProfile(true)}
            >
              <Building2 className="h-4 w-4 mr-2" />
              Company Profile
            </Button>
          </div>
        </>
      )}

      {/* Full Report Modal */}
      <Dialog open={showFullReport} onOpenChange={setShowFullReport}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Comprehensive Credit Report</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Report Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Executive Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {fullReportData.summary}
                </p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h4 className="font-semibold text-green-800 dark:text-green-200">
                      Overall Rating
                    </h4>
                    <p className="text-2xl font-bold text-green-600">A+</p>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200">
                      Risk Level
                    </h4>
                    <p className="text-2xl font-bold text-blue-600">Low</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Scores */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detailed Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(fullReportData.detailedScores).map(
                    ([category, data]) => (
                      <div key={category} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{category}</h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold">
                              {data.score}
                            </span>
                            <Badge
                              variant={
                                data.trend === "Excellent"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {data.trend}
                            </Badge>
                          </div>
                        </div>
                        <Progress value={data.score} className="mb-2" />
                        <p className="text-sm text-muted-foreground">
                          {data.details}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations & Risk Factors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-green-600">
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {fullReportData.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-yellow-600">
                    Risk Factors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {fullReportData.riskFactors.map((risk, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{risk}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Score History Modal */}
      <Dialog open={showScoreHistory} onOpenChange={setShowScoreHistory}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Credit Score History</span>
            </DialogTitle>
          </DialogHeader>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {scoreHistory.map((entry, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {new Date(entry.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Change:{" "}
                          <span
                            className={
                              entry.change.startsWith("+")
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {entry.change}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{entry.score}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="my-6" />
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Score has improved by{" "}
                  <span className="text-green-600 font-semibold">
                    +27 points
                  </span>{" "}
                  over the last 6 months
                </p>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>

      {/* Company Profile Modal */}
      <Dialog open={showCompanyProfile} onOpenChange={setShowCompanyProfile}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>Company Profile</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Company Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{companyProfile.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Registration: {companyProfile.registrationNumber}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Founded: {companyProfile.founded}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Industry: {companyProfile.industry}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Employees: {companyProfile.employees}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Revenue: {companyProfile.revenue}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        HQ: {companyProfile.headquarters}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {companyProfile.contactInfo.email}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {companyProfile.contactInfo.phone}
                      </span>
                    </div>
                  </div>
                </div>
                <Separator className="my-4" />
                <p className="text-sm text-muted-foreground">
                  {companyProfile.description}
                </p>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Award className="h-4 w-4 mr-2" />
                  Certifications & Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {companyProfile.certifications.map((cert, index) => (
                    <Badge key={index} variant="secondary">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Key Personnel */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Key Personnel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {companyProfile.keyPersonnel.map((person, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{person.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {person.role}
                        </p>
                      </div>
                      <Badge variant="outline">{person.experience}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreditScoring;

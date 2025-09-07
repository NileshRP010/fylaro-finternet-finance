import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  BarChart3,
  DollarSign,
  Users,
  FileText,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  PieChart,
  Activity,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from "lucide-react";

const AnalyticsDashboard = () => {
  const overviewStats = [
    {
      title: "Total Volume",
      value: "$12.7M",
      change: "+18.2%",
      icon: DollarSign,
      trend: "up",
      description: "Total invoice value processed",
    },
    {
      title: "Active Users",
      value: "2,847",
      change: "+24.5%",
      icon: Users,
      trend: "up",
      description: "Monthly active participants",
    },
    {
      title: "Invoices Processed",
      value: "1,432",
      change: "+12.8%",
      icon: FileText,
      trend: "up",
      description: "Total invoices tokenized",
    },
    {
      title: "Average Invoice Size",
      value: "$8,870",
      change: "-3.2%",
      icon: BarChart3,
      trend: "down",
      description: "Mean invoice value",
    },
  ];

  const invoiceMetrics = [
    {
      label: "Pending Invoices",
      value: 234,
      percentage: 16.3,
      color: "bg-yellow-500",
    },
    {
      label: "Approved Invoices",
      value: 892,
      percentage: 62.3,
      color: "bg-green-500",
    },
    {
      label: "Rejected Invoices",
      value: 89,
      percentage: 6.2,
      color: "bg-red-500",
    },
    {
      label: "Paid Invoices",
      value: 217,
      percentage: 15.2,
      color: "bg-blue-500",
    },
  ];

  const marketplaceStats = [
    {
      title: "Active Listings",
      value: "156",
      icon: Activity,
      color: "text-blue-600",
    },
    {
      title: "Total Trades",
      value: "423",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Average ROI",
      value: "8.4%",
      icon: ArrowUpRight,
      color: "text-emerald-600",
    },
    {
      title: "Liquidity Pool",
      value: "$2.3M",
      icon: Wallet,
      color: "text-purple-600",
    },
  ];

  const recentActivity = [
    {
      action: "Invoice Tokenized",
      amount: "$45,000",
      time: "2 minutes ago",
      status: "success",
    },
    {
      action: "Investment Made",
      amount: "$12,500",
      time: "5 minutes ago",
      status: "success",
    },
    {
      action: "Invoice Paid",
      amount: "$28,000",
      time: "12 minutes ago",
      status: "success",
    },
    {
      action: "Listing Created",
      amount: "$67,000",
      time: "18 minutes ago",
      status: "pending",
    },
    {
      action: "Risk Assessment",
      amount: "$89,000",
      time: "25 minutes ago",
      status: "warning",
    },
  ];

  const riskMetrics = [
    {
      category: "Low Risk",
      count: 892,
      percentage: 65.2,
      color: "bg-green-500",
    },
    {
      category: "Medium Risk",
      count: 356,
      percentage: 26.1,
      color: "bg-yellow-500",
    },
    { category: "High Risk", count: 119, percentage: 8.7, color: "bg-red-500" },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          Analytics Dashboard
        </h1>
        <Badge variant="outline" className="text-xs">
          <Calendar className="h-3 w-3 mr-1" />
          Last updated: {new Date().toLocaleString()}
        </Badge>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStats.map((stat, index) => (
          <Card
            key={index}
            className="bg-card border-border hover:shadow-md transition-shadow"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="flex items-center text-xs mt-1">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span
                  className={
                    stat.trend === "up" ? "text-green-500" : "text-red-500"
                  }
                >
                  {stat.change}
                </span>
                <span className="text-muted-foreground ml-1">
                  from last month
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Invoice Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <PieChart className="h-5 w-5 mr-2" />
              Invoice Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {invoiceMetrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{metric.label}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {metric.value}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({metric.percentage}%)
                    </span>
                  </div>
                </div>
                <Progress value={metric.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Marketplace Metrics */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <TrendingUp className="h-5 w-5 mr-2" />
              Marketplace Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {marketplaceStats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-4 rounded-lg bg-muted/20"
                >
                  <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">
                    {stat.title}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Assessment & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <AlertCircle className="h-5 w-5 mr-2" />
              Risk Assessment Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {riskMetrics.map((risk, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${risk.color}`}></div>
                  <span className="font-medium">{risk.category}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold">{risk.count}</span>
                  <span className="text-xs text-muted-foreground">
                    ({risk.percentage}%)
                  </span>
                </div>
              </div>
            ))}
            <Separator className="my-4" />
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">94.3%</div>
              <div className="text-sm text-muted-foreground">
                Overall Success Rate
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <Activity className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/10"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.status === "success"
                        ? "bg-green-500"
                        : activity.status === "warning"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                    }`}
                  ></div>
                  <div>
                    <div className="font-medium text-sm">{activity.action}</div>
                    <div className="text-xs text-muted-foreground">
                      {activity.time}
                    </div>
                  </div>
                </div>
                <div className="font-bold text-sm">{activity.amount}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <BarChart3 className="h-5 w-5 mr-2" />
            Platform Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">$12.7M</div>
              <div className="text-sm text-muted-foreground">
                Total Transaction Volume
              </div>
              <div className="text-xs text-green-600 mt-1">
                ↗ 18.2% vs last month
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">98.2%</div>
              <div className="text-sm text-muted-foreground">
                Platform Uptime
              </div>
              <div className="text-xs text-green-600 mt-1">
                ↗ 0.8% improvement
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">2.4s</div>
              <div className="text-sm text-muted-foreground">
                Average Transaction Time
              </div>
              <div className="text-xs text-green-600 mt-1">↗ 15% faster</div>
            </div>
          </div>
          <Separator className="my-6" />
          <div className="text-center">
            <p className="text-muted-foreground">
              Platform performance is optimal. All systems are operating
              efficiently with strong user engagement and transaction processing
              capabilities. Invoice tokenization success rate at 96.8%.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;

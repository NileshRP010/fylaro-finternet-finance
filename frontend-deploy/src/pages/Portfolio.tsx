import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CreditScoring from "@/components/features/CreditScoring";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  Clock,
  Target,
  BarChart3,
  PieChart,
  Eye,
  Download,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
  Legend,
  ComposedChart,
  Bar,
} from "recharts";

const Portfolio = () => {
  const navigate = useNavigate();
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const portfolioStats = [
    {
      title: "Total Invested",
      value: "$847,563",
      change: "+15.2%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Active Investments",
      value: "23",
      change: "+3",
      trend: "up",
      icon: FileText,
    },
    {
      title: "Total Returns",
      value: "$92,847",
      change: "+8.7%",
      trend: "up",
      icon: TrendingUp,
    },
    {
      title: "Avg. ROI",
      value: "11.2%",
      change: "+0.8%",
      trend: "up",
      icon: Target,
    },
  ];

  const activeInvestments = [
    {
      id: "INV-001",
      company: "TechFlow Solutions",
      amount: 50000,
      invested: 25000,
      currentValue: 27500,
      roi: 10.0,
      status: "Active",
      daysLeft: 14,
      riskLevel: "Low",
    },
    {
      id: "INV-002",
      company: "Green Energy Corp",
      amount: 89500,
      invested: 15000,
      currentValue: 16800,
      roi: 12.0,
      status: "Active",
      daysLeft: 21,
      riskLevel: "Medium",
    },
    {
      id: "INV-003",
      company: "MedTech Innovations",
      amount: 156000,
      invested: 30000,
      currentValue: 31200,
      roi: 4.0,
      status: "Active",
      daysLeft: 28,
      riskLevel: "Low",
    },
  ];

  const completedInvestments = [
    {
      id: "INV-C01",
      company: "RetailMax Inc",
      invested: 20000,
      finalValue: 22400,
      roi: 12.0,
      completedDate: "2024-01-15",
      duration: "45 days",
    },
    {
      id: "INV-C02",
      company: "BuildCo Ltd",
      invested: 35000,
      finalValue: 37800,
      roi: 8.0,
      completedDate: "2024-01-08",
      duration: "30 days",
    },
  ];

  // Enhanced portfolio performance data for impressive chart
  const portfolioPerformanceData = [
    {
      month: "Jan",
      portfolioValue: 750000,
      invested: 720000,
      profit: 30000,
      roi: 8.2,
      volume: 45000,
      benchmark: 745000,
      fees: 1200,
    },
    {
      month: "Feb",
      portfolioValue: 782000,
      invested: 745000,
      profit: 37000,
      roi: 9.1,
      volume: 52000,
      benchmark: 758000,
      fees: 1350,
    },
    {
      month: "Mar",
      portfolioValue: 798000,
      invested: 760000,
      profit: 38000,
      roi: 10.5,
      volume: 48000,
      benchmark: 772000,
      fees: 1180,
    },
    {
      month: "Apr",
      portfolioValue: 815000,
      invested: 775000,
      profit: 40000,
      roi: 11.2,
      volume: 56000,
      benchmark: 785000,
      fees: 1420,
    },
    {
      month: "May",
      portfolioValue: 832000,
      invested: 790000,
      profit: 42000,
      roi: 10.8,
      volume: 61000,
      benchmark: 801000,
      fees: 1580,
    },
    {
      month: "Jun",
      portfolioValue: 847563,
      invested: 805000,
      profit: 42563,
      roi: 11.2,
      volume: 58000,
      benchmark: 817000,
      fees: 1650,
    },
  ];

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "text-success";
      case "Medium":
        return "text-warning";
      case "High":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Investment Portfolio</h1>
            <p className="text-muted-foreground">
              Track your invoice investments and returns
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                /* Export functionality can be added later */
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button className="glow" onClick={() => navigate("/marketplace")}>
              <Eye className="h-4 w-4 mr-2" />
              Browse Marketplace
            </Button>
          </div>
        </div>

        {/* Portfolio Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {portfolioStats.map((stat) => (
            <Card key={stat.title} className="gradient-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-success mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive mr-1" />
                  )}
                  <span
                    className={
                      stat.trend === "up" ? "text-success" : "text-destructive"
                    }
                  >
                    {stat.change}
                  </span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Portfolio Breakdown */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Chart Placeholder */}
          <Card className="lg:col-span-2 gradient-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Portfolio Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={portfolioPerformanceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient
                        id="portfolioGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#8b5cf6"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8b5cf6"
                          stopOpacity={0.05}
                        />
                      </linearGradient>
                      <linearGradient
                        id="profitGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#22c55e"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#22c55e"
                          stopOpacity={0.05}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.08)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      stroke="rgba(255,255,255,0.7)"
                      fontSize={12}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      yAxisId="left"
                      stroke="rgba(255,255,255,0.7)"
                      fontSize={12}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) =>
                        `$${(value / 1000).toFixed(0)}k`
                      }
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="rgba(255,255,255,0.5)"
                      fontSize={12}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(15, 15, 15, 0.95)",
                        border: "1px solid rgba(139, 92, 246, 0.3)",
                        borderRadius: "12px",
                        color: "white",
                        boxShadow:
                          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                      }}
                      labelStyle={{ color: "#8b5cf6", fontWeight: "bold" }}
                      formatter={(value, name) => {
                        const formatters = {
                          portfolioValue: [
                            `$${value.toLocaleString()}`,
                            "Portfolio Value",
                          ],
                          benchmark: [
                            `$${value.toLocaleString()}`,
                            "Benchmark",
                          ],
                          profit: [
                            `$${value.toLocaleString()}`,
                            "Monthly Profit",
                          ],
                          volume: [
                            `$${value.toLocaleString()}`,
                            "Trading Volume",
                          ],
                          roi: [`${value}%`, "ROI"],
                        };
                        return formatters[name] || [value, name];
                      }}
                    />
                    <Legend
                      wrapperStyle={{ color: "rgba(255,255,255,0.8)" }}
                      iconType="circle"
                    />

                    {/* Area chart for portfolio value */}
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="portfolioValue"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      fill="url(#portfolioGradient)"
                      name="Portfolio Value"
                    />

                    {/* Line for benchmark comparison */}
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="benchmark"
                      stroke="#64748b"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                      name="Benchmark"
                    />

                    {/* Bar chart for monthly profit */}
                    <Bar
                      yAxisId="left"
                      dataKey="profit"
                      fill="url(#profitGradient)"
                      stroke="#22c55e"
                      strokeWidth={1}
                      radius={[2, 2, 0, 0]}
                      opacity={0.7}
                      name="Monthly Profit"
                    />

                    {/* ROI line */}
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="roi"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={{ fill: "#f59e0b", strokeWidth: 2, r: 3 }}
                      activeDot={{
                        r: 5,
                        stroke: "#f59e0b",
                        strokeWidth: 2,
                        fill: "#fbbf24",
                      }}
                      name="ROI %"
                    />

                    {/* Reference line for break-even */}
                    <ReferenceLine
                      yAxisId="left"
                      y={750000}
                      stroke="#ef4444"
                      strokeDasharray="2 2"
                      strokeOpacity={0.6}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Allocation */}
          <Card className="gradient-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Asset Allocation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Technology</span>
                  <span className="text-sm font-medium">35%</span>
                </div>
                <Progress value={35} />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Healthcare</span>
                  <span className="text-sm font-medium">25%</span>
                </div>
                <Progress value={25} />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Energy</span>
                  <span className="text-sm font-medium">20%</span>
                </div>
                <Progress value={20} />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Retail</span>
                  <span className="text-sm font-medium">20%</span>
                </div>
                <Progress value={20} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Credit Scoring Integration */}
        <CreditScoring />

        {/* Investment Tabs */}
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Active Investments</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            <div className="grid gap-4">
              {activeInvestments.map((investment) => (
                <Card
                  key={investment.id}
                  className="gradient-card border-border"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {investment.company}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {investment.id}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant="secondary"
                          className={getRiskColor(investment.riskLevel)}
                        >
                          {investment.riskLevel} Risk
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Invested
                        </p>
                        <p className="font-semibold">
                          {formatAmount(investment.invested)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Current Value
                        </p>
                        <p className="font-semibold text-success">
                          {formatAmount(investment.currentValue)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">ROI</p>
                        <p className="font-semibold text-success">
                          +{investment.roi}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Days Left
                        </p>
                        <p className="font-semibold">{investment.daysLeft}d</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <Badge variant="default">{investment.status}</Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>
                            {Math.round(
                              (investment.invested / investment.amount) * 100
                            )}
                            %
                          </span>
                        </div>
                        <Progress
                          value={
                            (investment.invested / investment.amount) * 100
                          }
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedInvestment(investment);
                          setIsDetailsModalOpen(true);
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <div className="grid gap-4">
              {completedInvestments.map((investment) => (
                <Card
                  key={investment.id}
                  className="gradient-card border-border"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {investment.company}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {investment.id}
                        </p>
                      </div>
                      <Badge className="bg-success">Completed</Badge>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Invested
                        </p>
                        <p className="font-semibold">
                          {formatAmount(investment.invested)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Final Value
                        </p>
                        <p className="font-semibold text-success">
                          {formatAmount(investment.finalValue)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Total ROI
                        </p>
                        <p className="font-semibold text-success">
                          +{investment.roi}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Duration
                        </p>
                        <p className="font-semibold">{investment.duration}</p>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedInvestment(investment);
                          setIsDetailsModalOpen(true);
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Investment Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-2xl gradient-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Investment Details
            </DialogTitle>
            <DialogDescription>
              Comprehensive information about your investment
            </DialogDescription>
          </DialogHeader>

          {selectedInvestment && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    {selectedInvestment.company}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Investment ID: {selectedInvestment.id}
                  </p>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      selectedInvestment.status === "Active"
                        ? "default"
                        : "secondary"
                    }
                    className="mb-2"
                  >
                    {selectedInvestment.status}
                  </Badge>
                  <p className="text-lg font-bold text-success">
                    +{selectedInvestment.roi}% ROI
                  </p>
                </div>
              </div>

              {/* Financial Overview */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-muted/20 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-xl font-bold">
                    $
                    {selectedInvestment.amount?.toLocaleString() ||
                      selectedInvestment.invested?.toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Invested</p>
                  <p className="text-xl font-bold">
                    ${selectedInvestment.invested.toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Current Value</p>
                  <p className="text-xl font-bold text-success">
                    $
                    {(
                      selectedInvestment.currentValue ||
                      selectedInvestment.finalValue ||
                      selectedInvestment.invested *
                        (1 + selectedInvestment.roi / 100)
                    ).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Progress Information */}
              {selectedInvestment.amount && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Investment Progress</span>
                    <span>
                      {Math.round(
                        (selectedInvestment.invested /
                          selectedInvestment.amount) *
                          100
                      )}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      (selectedInvestment.invested /
                        selectedInvestment.amount) *
                      100
                    }
                    className="mb-4"
                  />
                </div>
              )}

              {/* Risk Assessment */}
              <div className="p-4 bg-muted/10 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  Risk Assessment
                </h4>
                <div className="flex justify-between items-center">
                  <span>Risk Level:</span>
                  <Badge
                    variant={
                      selectedInvestment.riskLevel === "Low"
                        ? "secondary"
                        : selectedInvestment.riskLevel === "Medium"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {selectedInvestment.riskLevel || "Medium"}
                  </Badge>
                </div>
              </div>

              {/* Timeline Information */}
              <div className="p-4 bg-muted/10 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Timeline
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {selectedInvestment.daysLeft && (
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Days Remaining:
                      </span>
                      <p className="font-semibold">
                        {selectedInvestment.daysLeft} days
                      </p>
                    </div>
                  )}
                  {selectedInvestment.duration && (
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Duration:
                      </span>
                      <p className="font-semibold">
                        {selectedInvestment.duration}
                      </p>
                    </div>
                  )}
                  {selectedInvestment.completedDate && (
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Completed:
                      </span>
                      <p className="font-semibold">
                        {selectedInvestment.completedDate}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  Download Report
                </Button>
                <Button className="flex-1 glow">Manage Investment</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Portfolio;

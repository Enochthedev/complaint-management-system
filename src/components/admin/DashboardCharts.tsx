"use client";

import * as React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Pie,
  PieChart,
  Label,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DashboardChartsProps {
  complaintsOverTime: Array<{
    date: string;
    count: number;
  }>;
  statusDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  complaintsByType: Array<{
    type: string;
    count: number;
  }>;
  averageResolutionTime: number;
}

const chartConfig = {
  complaints: {
    label: "Complaints",
    color: "hsl(var(--chart-1))",
  },
  pending: {
    label: "Pending",
    color: "hsl(var(--chart-2))",
  },
  in_progress: {
    label: "In Progress",
    color: "hsl(var(--chart-3))",
  },
  resolved: {
    label: "Resolved",
    color: "hsl(var(--chart-4))",
  },
  rejected: {
    label: "Rejected",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function DashboardCharts({
  complaintsOverTime,
  statusDistribution,
  complaintsByType,
  averageResolutionTime,
}: DashboardChartsProps) {
  const [timeRange, setTimeRange] = React.useState("30d");

  // Filter data based on time range
  const filteredData = React.useMemo(() => {
    let days = 30;
    if (timeRange === "7d") days = 7;
    if (timeRange === "90d") days = 90;

    return complaintsOverTime.slice(-days);
  }, [complaintsOverTime, timeRange]);

  // Prepare pie chart data
  const pieChartData = statusDistribution.map((item, index) => ({
    status: item.name.toLowerCase().replace(" ", "_"),
    count: item.value,
    fill: `hsl(var(--chart-${index + 1}))`,
  }));

  // Prepare bar chart data
  const barChartData = complaintsByType.map((item) => ({
    type: item.type,
    count: item.count,
  }));

  const totalComplaints = React.useMemo(() => {
    return statusDistribution.reduce((acc, curr) => acc + curr.value, 0);
  }, [statusDistribution]);

  const trend = React.useMemo(() => {
    if (filteredData.length < 2) return { direction: "neutral", percentage: 0 };

    const recent = filteredData
      .slice(-7)
      .reduce((sum, item) => sum + item.count, 0);
    const previous = filteredData
      .slice(-14, -7)
      .reduce((sum, item) => sum + item.count, 0);

    if (previous === 0) return { direction: "neutral", percentage: 0 };

    const percentage = ((recent - previous) / previous) * 100;
    return {
      direction: percentage > 0 ? "up" : percentage < 0 ? "down" : "neutral",
      percentage: Math.abs(percentage),
    };
  }, [filteredData]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Complaints Over Time - Area Chart */}
      <Card className="lg:col-span-2">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>Complaints Over Time</CardTitle>
            <CardDescription>
              Showing complaint submissions for the selected period
            </CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="w-[160px] rounded-lg sm:ml-auto"
              aria-label="Select a time range"
            >
              <SelectValue placeholder="Last 30 days" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[300px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillComplaints" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-complaints)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-complaints)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  return value;
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => value}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="count"
                type="natural"
                fill="url(#fillComplaints)"
                stroke="var(--color-complaints)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 leading-none font-medium">
            {trend.direction === "up" ? (
              <>
                Trending up by {trend.percentage.toFixed(1)}% this week
                <TrendingUp className="h-4 w-4" />
              </>
            ) : trend.direction === "down" ? (
              <>
                Trending down by {trend.percentage.toFixed(1)}% this week
                <TrendingDown className="h-4 w-4" />
              </>
            ) : (
              "No significant change this week"
            )}
          </div>
          <div className="text-muted-foreground leading-none">
            Showing complaint data for the selected time period
          </div>
        </CardFooter>
      </Card>

      {/* Status Distribution - Pie Chart */}
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Status Distribution</CardTitle>
          <CardDescription>Current status of all complaints</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={pieChartData}
                dataKey="count"
                nameKey="status"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalComplaints.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Total
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 leading-none font-medium">
            {statusDistribution.find((s) => s.name === "Resolved")?.value || 0}{" "}
            complaints resolved
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">
            Distribution of complaint statuses
          </div>
        </CardFooter>
      </Card>

      {/* Complaints by Type - Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Complaints by Type</CardTitle>
          <CardDescription>
            Distribution of complaint categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <BarChart data={barChartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="type"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 10)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey="count" fill="var(--color-complaints)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 leading-none font-medium">
            Most common: {barChartData[0]?.type || "N/A"}
          </div>
          <div className="text-muted-foreground leading-none">
            Breakdown by complaint category
          </div>
        </CardFooter>
      </Card>

      {/* Performance Metrics */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>Key performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-6 border rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {averageResolutionTime.toFixed(1)}
              </div>
              <div className="text-sm text-blue-600/70 dark:text-blue-400/70 mt-1">
                Avg. Resolution Time (days)
              </div>
            </div>
            <div className="text-center p-6 border rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {statusDistribution.find((s) => s.name === "Resolved")?.value ||
                  0}
              </div>
              <div className="text-sm text-green-600/70 dark:text-green-400/70 mt-1">
                Resolved This Month
              </div>
            </div>
            <div className="text-center p-6 border rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900">
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {statusDistribution.find((s) => s.name === "Pending")?.value ||
                  0}
              </div>
              <div className="text-sm text-yellow-600/70 dark:text-yellow-400/70 mt-1">
                Pending Review
              </div>
            </div>
            <div className="text-center p-6 border rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {(
                  ((statusDistribution.find((s) => s.name === "Resolved")
                    ?.value || 0) /
                    totalComplaints) *
                  100
                ).toFixed(1)}
                %
              </div>
              <div className="text-sm text-purple-600/70 dark:text-purple-400/70 mt-1">
                Resolution Rate
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

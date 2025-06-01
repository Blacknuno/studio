
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";
import { userStatusData, UserStatusData } from "./mock-data";
import { CircleUserRound, UserCog, UserX, Ban } from "lucide-react";

const chartConfig = {
  users: {
    label: "Users",
  },
  active: {
    label: "Active",
    color: "hsl(var(--chart-1))",
    icon: CircleUserRound,
  },
  inactive: {
    label: "Inactive",
    color: "hsl(var(--chart-2))",
    icon: UserCog,
  },
  expired: {
    label: "Expired",
    color: "hsl(var(--chart-3))",
    icon: UserX,
  },
  banned: {
    label: "Banned",
    color: "hsl(var(--chart-4))",
    icon: Ban,
  },
} satisfies import("@/components/ui/chart").ChartConfig;


export function UserStatusChartCard() {
  const totalUsers = React.useMemo(() => {
    return userStatusData.reduce((acc, curr) => acc + curr.value, 0);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">User Statistics</CardTitle>
        <CardDescription className="font-body">Distribution of users by status</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
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
              data={userStatusData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
              {userStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
             <ChartLegend content={<ChartLegendContent nameKey="name" />} />
          </PieChart>
        </ChartContainer>
         <p className="mt-4 text-center text-sm font-medium font-body">
            Total Users: <span className="font-headline">{totalUsers}</span>
          </p>
      </CardContent>
    </Card>
  );
}


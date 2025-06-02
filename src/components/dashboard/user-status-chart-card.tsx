
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
import { mockUsers, type User, UserStatus } from "@/app/users/user-data"; // Import mockUsers
import { CircleUserRound, UserCog, UserX, Ban, Users } from "lucide-react";

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
  const [userStatusData, setUserStatusData] = React.useState<Array<{name: string, value: number, fill: string}>>([]);

  React.useEffect(() => {
    const activeUsers = mockUsers.filter(u => u.status === 'Active' && u.isEnabled).length;
    const inactiveUsers = mockUsers.filter(u => u.status === 'Inactive' || !u.isEnabled).length;
    const expiredUsers = mockUsers.filter(u => u.status === 'Expired').length;
    const bannedUsers = mockUsers.filter(u => u.status === 'Banned').length;
    
    const data = [];
    if (activeUsers > 0) data.push({ name: "Active", value: activeUsers, fill: "hsl(var(--chart-1))" });
    if (inactiveUsers > 0) data.push({ name: "Inactive", value: inactiveUsers, fill: "hsl(var(--chart-2))" });
    if (expiredUsers > 0) data.push({ name: "Expired", value: expiredUsers, fill: "hsl(var(--chart-3))" });
    if (bannedUsers > 0) data.push({ name: "Banned", value: bannedUsers, fill: "hsl(var(--chart-4))" });
    
    setUserStatusData(data);
  }, [mockUsers]); // Re-calculate when mockUsers array changes

  const totalUsers = React.useMemo(() => {
    return userStatusData.reduce((acc, curr) => acc + curr.value, 0);
  }, [userStatusData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">User Statistics</CardTitle>
        <CardDescription className="font-body">Distribution of users by status (Live Mock Data)</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {totalUsers > 0 ? (
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
        ) : (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h4 className="font-headline text-lg mb-1">No User Data Available</h4>
            <p className="text-sm text-muted-foreground font-body">
              Create users in User Management to see statistics.
            </p>
          </div>
        )}
         <p className="mt-4 text-center text-sm font-medium font-body">
            Total Users: <span className="font-headline">{totalUsers}</span>
          </p>
      </CardContent>
    </Card>
  );
}

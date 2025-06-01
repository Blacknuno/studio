
"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit3, PlusCircle } from "lucide-react";
import type { User } from "@/app/users/user-data";
import { calculateExpiresOn } from "@/app/users/user-data";
import { UserFormDialog } from "./user-form-dialog";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

interface UsersTableProps {
  initialUsers: User[];
}

const PIE_COLORS = ['hsl(var(--chart-2))', 'hsl(var(--chart-1))']; // Used (Accent), Remaining (Primary)

export function UsersTable({ initialUsers }: UsersTableProps) {
  const [users, setUsers] = React.useState<User[]>(initialUsers);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [lastInteractedUserId, setLastInteractedUserId] = React.useState<string | null>(null);

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleFormSave = (userToSave: User) => {
    let newUserId = userToSave.id;
    if (selectedUser) {
      // Edit existing user
      setUsers(users.map((u) => (u.id === userToSave.id ? userToSave : u)));
    } else {
      // Add new user
      newUserId = `usr_${Date.now()}`;
      const newUser = { ...userToSave, id: newUserId , createdAt: new Date().toISOString() };
      setUsers([newUser, ...users]);
    }
    setLastInteractedUserId(newUserId);
    setIsFormOpen(false);
    setSelectedUser(null);
  };
  
  const getStatusVariant = (status: User['status']) => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Inactive':
        return 'secondary';
      case 'Expired':
        return 'outline';
      case 'Banned':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const renderDataUsageChart = (user: User) => {
    const actualUsedGB = Math.min(user.dataUsedGB, user.dataAllowanceGB);
    const remainingGB = Math.max(0, user.dataAllowanceGB - actualUsedGB);
    
    const data = [
      { name: "Used", value: actualUsedGB },
      { name: "Remaining", value: remainingGB },
    ];

    if (user.dataAllowanceGB === 0 && user.dataUsedGB === 0) {
      return <span className="text-xs text-muted-foreground">N/A</span>;
    }
    if (user.dataAllowanceGB === 0 && user.dataUsedGB > 0) {
       return <span className="text-xs text-destructive">Error</span>;
    }


    return (
      <div style={{ width: 60, height: 60, margin: 'auto' }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={15}
              outerRadius={25}
              fill="#8884d8"
              paddingAngle={2}
              dataKey="value"
              stroke="hsl(var(--background))"
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
                fontSize: '12px',
                fontFamily: 'var(--font-body)'
              }}
              formatter={(value, name) => [`${value} GB`, name]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };


  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleAddUser} className="font-body">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New User
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-body">Username</TableHead>
              <TableHead className="font-body">Full Name</TableHead>
              <TableHead className="font-body">Status</TableHead>
              <TableHead className="font-body">Protocol</TableHead>
              <TableHead className="font-body text-center">Data Usage</TableHead>
              <TableHead className="font-body">Expires On</TableHead>
              <TableHead className="font-body text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow 
                key={user.id}
                className={cn(
                  user.id === lastInteractedUserId && "bg-accent/20 hover:bg-accent/30"
                )}
              >
                <TableCell className="font-medium font-body">{user.username}</TableCell>
                <TableCell className="font-body">{user.fullName}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(user.status)} className="font-body">{user.status}</Badge>
                </TableCell>
                <TableCell className="font-body">{user.protocol}</TableCell>
                <TableCell className="text-center p-1">{renderDataUsageChart(user)}</TableCell>
                <TableCell className="font-body">{calculateExpiresOn(user.createdAt, user.validityPeriodDays)}</TableCell>
                <TableCell className="text-center">
                  <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
                    <Edit3 className="h-4 w-4" />
                    <span className="sr-only">Edit User</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {isFormOpen && (
        <UserFormDialog
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedUser(null);
          }}
          onSave={handleFormSave}
          userData={selectedUser}
        />
      )}
    </div>
  );
}

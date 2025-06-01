
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
import { calculateExpiresOn, mockUsers as defaultUsers } from "@/app/users/user-data";
import { UserFormDialog } from "./user-form-dialog";
import { Badge } from "@/components/ui/badge";

interface UsersTableProps {
  initialUsers: User[];
}

export function UsersTable({ initialUsers }: UsersTableProps) {
  const [users, setUsers] = React.useState<User[]>(initialUsers);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleFormSave = (userToSave: User) => {
    if (selectedUser) {
      // Edit existing user
      setUsers(users.map((u) => (u.id === userToSave.id ? userToSave : u)));
    } else {
      // Add new user
      const newUser = { ...userToSave, id: `usr_${Date.now()}` , createdAt: new Date().toISOString() };
      setUsers([newUser, ...users]);
    }
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
              <TableHead className="font-body text-right">Data (GB)</TableHead>
              <TableHead className="font-body">Expires On</TableHead>
              <TableHead className="font-body text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium font-body">{user.username}</TableCell>
                <TableCell className="font-body">{user.fullName}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(user.status)} className="font-body">{user.status}</Badge>
                </TableCell>
                <TableCell className="font-body">{user.protocol}</TableCell>
                <TableCell className="text-right font-body">{user.dataAllowanceGB}</TableCell>
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

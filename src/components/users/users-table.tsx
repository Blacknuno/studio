
"use client";

import * as React from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button, buttonVariants } from "@/components/ui/button";
import { Edit3, PlusCircle, DownloadCloud, QrCode, ExternalLink, Route, Trash2 } from "lucide-react";
import type { User } from "@/app/users/user-data";
import { calculateExpiresOn, kernels as kernelDefinitions, mockUsers as initialMockUsers } from "@/app/users/user-data"; // Use initialMockUsers
import { UserFormDialog } from "./user-form-dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { DataUsageBar } from "./data-usage-bar";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface UsersTableProps {
  initialUsers: User[]; // This prop might become less relevant if we always start empty from user-data.ts
}

export function UsersTable({ initialUsers }: UsersTableProps) {
  // Initialize with initialUsers from user-data.ts, which should now be empty
  const [users, setUsers] = React.useState<User[]>(initialMockUsers);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [lastInteractedUserId, setLastInteractedUserId] = React.useState<string | null>(null);
  const [userToDelete, setUserToDelete] = React.useState<User | null>(null);
  const { toast } = useToast();

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const confirmDeleteUser = (user: User) => {
    setUserToDelete(user);
  };

  const handleDeleteUser = () => {
    if (!userToDelete) return;
    setUsers(users.filter(u => u.id !== userToDelete.id));
    toast({
      title: "User Deleted",
      description: `User "${userToDelete.username}" has been deleted (mocked).`,
      variant: "destructive"
    });
    setUserToDelete(null); // Close the dialog
  };

  const handleToggleUserEnabled = (userId: string, currentIsEnabled: boolean) => {
    const updatedUsers = users.map((u) =>
      u.id === userId ? { ...u, isEnabled: !currentIsEnabled, status: !currentIsEnabled ? 'Active' : 'Inactive' } : u
    );
    setUsers(updatedUsers);
    setLastInteractedUserId(userId);
    toast({
      title: `User ${!currentIsEnabled ? "Enabled" : "Disabled"}`,
      description: `${updatedUsers.find(u=>u.id === userId)?.username} has been ${!currentIsEnabled ? "enabled" : "disabled"}.`,
    });
  };

  const handleFormSave = (userToSave: User) => {
    let newUserId = userToSave.id;
    if (selectedUser) { // Editing existing user
      setUsers(users.map((u) => (u.id === userToSave.id ? userToSave : u)));
      newUserId = selectedUser.id;
    } else { // Adding new user
      newUserId = `usr_${Date.now()}`;
      const newUserWithId = { 
        ...userToSave, 
        id: newUserId, 
        createdAt: new Date().toISOString(),
        sublinkPath: userToSave.sublinkPath || `sub_${userToSave.username.toLowerCase().replace(/[^a-z0-9]/gi, '')}_${Math.random().toString(36).substring(2, 8)}`
      };
      setUsers([newUserWithId, ...users]);
    }
    setLastInteractedUserId(newUserId);
    setIsFormOpen(false);
    setSelectedUser(null);
    toast({
      title: selectedUser ? "User Updated" : "User Created",
      description: `${userToSave.username} has been ${selectedUser ? "updated" : "created"}.`,
    });
  };
  
  const getStatusVariant = (status: User['status'], isEnabled: boolean) => {
    if (!isEnabled) return 'secondary'; 
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

  const getKernelName = (kernelId: string) => {
    return kernelDefinitions.find(k => k.id === kernelId)?.name || kernelId;
  };
  
  const getProtocolLabel = (kernelId: string, protocolName: string) => {
    const kernel = kernelDefinitions.find(k => k.id === kernelId);
    return kernel?.protocols.find(p => p.name === protocolName)?.label || protocolName;
  };

  const getTunnelInfo = (user: User): string => {
    if (user.enableTunnelSetup && user.tunnelConfig && user.tunnelConfig.service !== 'none') {
      let info = user.tunnelConfig.service.charAt(0).toUpperCase() + user.tunnelConfig.service.slice(1);
      if (user.tunnelConfig.countries && user.tunnelConfig.countries.length > 0) {
        info += `: ${user.tunnelConfig.countries.slice(0, 2).join(', ')}${user.tunnelConfig.countries.length > 2 ? '...' : ''}`;
      }
      return info;
    }
    return "No Tunnel";
  };


  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleAddUser} className="font-body">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New User
        </Button>
      </div>
      {users.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-body">Username</TableHead>
                <TableHead className="font-body">Status</TableHead>
                <TableHead className="font-body">Kernel/Proto</TableHead>
                <TableHead className="font-body">Tunnel</TableHead>
                <TableHead className="font-body text-center w-[150px]">Data Usage</TableHead>
                <TableHead className="font-body">Expires On</TableHead>
                <TableHead className="font-body text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow 
                  key={user.id}
                  className={cn(
                    user.id === lastInteractedUserId && "bg-accent/20 hover:bg-accent/30",
                    !user.isEnabled && "opacity-60 hover:opacity-70"
                  )}
                >
                  <TableCell className="font-medium font-body py-2">
                    <div>{user.username}</div>
                    <div className="text-xs text-muted-foreground">{user.fullName}</div>
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="flex items-center space-x-2">
                       <Switch
                          id={`enable-user-${user.id}`}
                          checked={user.isEnabled}
                          onCheckedChange={() => handleToggleUserEnabled(user.id, user.isEnabled)}
                          aria-label={`Enable or disable user ${user.username}`}
                        />
                      <Badge variant={getStatusVariant(user.status, user.isEnabled)} className="font-body text-xs">{user.status}</Badge>
                    </div>
                  </TableCell>
                  <TableCell className="font-body py-2 text-sm">
                      <div>{getKernelName(user.kernelId)}</div>
                      <div className="text-xs text-muted-foreground">{getProtocolLabel(user.kernelId, user.protocol)}</div>
                  </TableCell>
                  <TableCell className="font-body py-2 text-sm">
                      <div className="flex items-center">
                          {(user.enableTunnelSetup && user.tunnelConfig && user.tunnelConfig.service !== 'none') && <Route className="h-4 w-4 mr-1.5 text-primary" />}
                           {getTunnelInfo(user)}
                      </div>
                  </TableCell>
                  <TableCell className="text-center p-2">
                    <DataUsageBar used={user.dataUsedGB} allowance={user.dataAllowanceGB} />
                  </TableCell>
                  <TableCell className="font-body py-2">{calculateExpiresOn(user.createdAt, user.validityPeriodDays)}</TableCell>
                  <TableCell className="text-center py-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)} title="Edit User">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => toast({ title: "Download Config", description: `Preparing config for ${user.username}... (mock)`})} title="Download Config">
                      <DownloadCloud className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => toast({ title: "Show QR Code", description: `Generating QR code for ${user.username}... (mock)`})} title="Show QR Code">
                      <QrCode className="h-4 w-4" />
                    </Button>
                    {user.sublinkPath && (
                      <Link href={`/sub/${user.sublinkPath}`} target="_blank" passHref>
                        <Button variant="ghost" size="icon" title="Subscription Page">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" title="Delete User" onClick={() => confirmDeleteUser(user)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      {userToDelete && userToDelete.id === user.id && ( // Ensure dialog is for the correct user
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the user account for <strong>{userToDelete.username}</strong> and all associated data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setUserToDelete(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteUser} className={cn(buttonVariants({variant: "destructive"}))}>
                              Delete User
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      )}
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
         <div className="text-center py-10 border-2 border-dashed border-muted rounded-lg">
            <UsersRound className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-xl font-headline mb-1">No Users Yet</h3>
            <p className="text-muted-foreground font-body mb-4">Click "Add New User" to get started.</p>
        </div>
      )}

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

    
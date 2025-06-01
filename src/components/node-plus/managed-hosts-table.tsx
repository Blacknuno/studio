
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
import { Badge } from "@/components/ui/badge";
import { Edit3, PlusCircle, Trash2, Globe } from "lucide-react";
import type { ManagedHost } from "@/app/users/user-data";
import { mockManagedHosts } from "@/app/users/user-data";
import { AddHostDialog } from "./add-host-dialog";
import { useToast } from "@/hooks/use-toast";
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
import { cn } from "@/lib/utils";


export function ManagedHostsTable() {
  const [hosts, setHosts] = React.useState<ManagedHost[]>(mockManagedHosts);
  const [selectedHost, setSelectedHost] = React.useState<ManagedHost | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [hostToDelete, setHostToDelete] = React.useState<ManagedHost | null>(null);
  const { toast } = useToast();

  const handleAddHost = () => {
    setSelectedHost(null);
    setIsFormOpen(true);
  };

  const handleEditHost = (host: ManagedHost) => {
    setSelectedHost(host);
    setIsFormOpen(true);
  };

  const handleDeleteHost = () => {
    if (!hostToDelete) return;
    setHosts(hosts.filter(h => h.id !== hostToDelete.id));
    toast({
      title: "Managed Host Deleted",
      description: `Host "${hostToDelete.name}" has been deleted (mocked).`,
      variant: "destructive"
    });
    setHostToDelete(null);
  };

  const handleSaveHost = (hostData: ManagedHost) => {
    if (selectedHost) {
      setHosts(hosts.map(h => (h.id === hostData.id ? hostData : h)));
      toast({
        title: "Managed Host Updated",
        description: `Host "${hostData.name}" has been updated (mocked).`,
      });
    } else {
      const newHost = { ...hostData, id: `host_${Date.now()}_${Math.random().toString(36).substring(2, 7)}` };
      setHosts([newHost, ...hosts]);
      toast({
        title: "Managed Host Added",
        description: `Host "${newHost.name}" has been added (mocked).`,
      });
    }
    setIsFormOpen(false);
    setSelectedHost(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleAddHost} className="font-body">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Host
        </Button>
      </div>
      {hosts.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-body">Name</TableHead>
                <TableHead className="font-body">Host Name</TableHead>
                <TableHead className="font-body">Address:Port</TableHead>
                <TableHead className="font-body">Notes</TableHead>
                <TableHead className="font-body text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hosts.map((host) => (
                <TableRow key={host.id}>
                  <TableCell className="font-medium font-body">{host.name}</TableCell>
                  <TableCell className="font-body">{host.hostName}</TableCell>
                  <TableCell className="font-body">{host.address}:{host.port}</TableCell>
                  <TableCell className="font-body text-sm text-muted-foreground truncate max-w-xs">{host.notes || "N/A"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEditHost(host)} title="Edit Host">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button variant="ghost" size="icon" title="Delete Host" onClick={() => setHostToDelete(host)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the host configuration for "{hostToDelete?.name}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setHostToDelete(null)}>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteHost} className={cn("bg-destructive text-destructive-foreground hover:bg-destructive/90")}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground font-body text-center py-4">No managed hosts configured yet.</p>
      )}

      {isFormOpen && (
        <AddHostDialog
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedHost(null);
          }}
          onSave={handleSaveHost}
          hostData={selectedHost}
        />
      )}
    </div>
  );
}

    

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
import { Edit3, PlusCircle, Trash2, TerminalSquare, Wifi, WifiOff, AlertTriangle, Loader2 } from "lucide-react";
import type { ServerNode, ServerNodeStatus } from "@/app/users/user-data";
import { mockServerNodes } from "@/app/users/user-data";
import { AddNodeDialog } from "./add-node-dialog";
import { SetupSnippetDialog } from "./setup-snippet-dialog";
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


const getStatusBadgeVariant = (status: ServerNodeStatus): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "Online":
      return "default"; // Green or primary
    case "Offline":
      return "secondary"; // Gray
    case "Error":
      return "destructive"; // Red
    case "Connecting":
      return "outline"; // Blue-ish
    default:
      return "secondary";
  }
};

const StatusIcon = ({ status }: { status: ServerNodeStatus }) => {
  switch (status) {
    case "Online":
      return <Wifi className="h-4 w-4 text-green-500" />;
    case "Offline":
      return <WifiOff className="h-4 w-4 text-gray-500" />;
    case "Error":
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case "Connecting":
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    default:
      return null;
  }
};


export function ServerNodesTable() {
  const [nodes, setNodes] = React.useState<ServerNode[]>(mockServerNodes);
  const [selectedNode, setSelectedNode] = React.useState<ServerNode | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isSnippetOpen, setIsSnippetOpen] = React.useState(false);
  const [nodeToDelete, setNodeToDelete] = React.useState<ServerNode | null>(null);
  const { toast } = useToast();

  const handleAddNode = () => {
    setSelectedNode(null);
    setIsFormOpen(true);
  };

  const handleEditNode = (node: ServerNode) => {
    setSelectedNode(node);
    setIsFormOpen(true);
  };

  const handleViewSnippet = (node: ServerNode) => {
    setSelectedNode(node);
    setIsSnippetOpen(true);
  };

  const handleDeleteNode = () => {
    if (!nodeToDelete) return;
    setNodes(nodes.filter(n => n.id !== nodeToDelete.id));
    toast({
      title: "Server Node Deleted",
      description: `Node "${nodeToDelete.name}" has been deleted (mocked).`,
      variant: "destructive"
    });
    setNodeToDelete(null);
  };

  const handleSaveNode = (nodeData: ServerNode) => {
    if (selectedNode) {
      setNodes(nodes.map(n => (n.id === nodeData.id ? nodeData : n)));
      toast({
        title: "Server Node Updated",
        description: `Node "${nodeData.name}" has been updated (mocked).`,
      });
    } else {
      const newNode = { ...nodeData, id: `node_${Date.now()}_${Math.random().toString(36).substring(2, 7)}` };
      setNodes([newNode, ...nodes]);
      toast({
        title: "Server Node Added",
        description: `Node "${newNode.name}" has been added (mocked).`,
      });
    }
    setIsFormOpen(false);
    setSelectedNode(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleAddNode} className="font-body">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Server Node
        </Button>
      </div>
      {nodes.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-body">Name</TableHead>
                <TableHead className="font-body">Address</TableHead>
                <TableHead className="font-body">Port</TableHead>
                <TableHead className="font-body">Connection Type</TableHead>
                <TableHead className="font-body text-center">Cons. Factor</TableHead>
                <TableHead className="font-body text-center">Status</TableHead>
                <TableHead className="font-body text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nodes.map((node) => (
                <TableRow key={node.id}>
                  <TableCell className="font-medium font-body">{node.name}</TableCell>
                  <TableCell className="font-body">{node.address}</TableCell>
                  <TableCell className="font-body">{node.port}</TableCell>
                  <TableCell className="font-body">
                    <Badge variant="outline" className="capitalize">{node.connectionType}</Badge>
                  </TableCell>
                  <TableCell className="font-body text-center">{node.consumptionFactor.toFixed(1)}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <StatusIcon status={node.status} />
                      <Badge variant={getStatusBadgeVariant(node.status)} className="font-body text-xs capitalize">
                        {node.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleViewSnippet(node)} title="View Setup Snippet">
                      <TerminalSquare className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEditNode(node)} title="Edit Node">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button variant="ghost" size="icon" title="Delete Node" onClick={() => setNodeToDelete(node)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the server node "{nodeToDelete?.name}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setNodeToDelete(null)}>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteNode} className={cn(buttonVariants({variant: "destructive"}))}>Delete</AlertDialogAction>
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
        <p className="text-sm text-muted-foreground font-body text-center py-4">No server nodes configured yet.</p>
      )}

      {isFormOpen && (
        <AddNodeDialog
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedNode(null);
          }}
          onSave={handleSaveNode}
          nodeData={selectedNode}
        />
      )}
      {isSnippetOpen && selectedNode && (
         <SetupSnippetDialog
            isOpen={isSnippetOpen}
            onClose={() => {
                setIsSnippetOpen(false);
                setSelectedNode(null);
            }}
            nodeName={selectedNode.name}
         />
      )}
    </div>
  );
}

// Helper for delete button variant (not strictly necessary here as Tailwind handles destructive variant, but good practice)
const buttonVariants = ({variant}: {variant?: "destructive" | string | null}) => {
    if (variant === "destructive") {
        return "bg-destructive text-destructive-foreground hover:bg-destructive/90";
    }
    return "";
}

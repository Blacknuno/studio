
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Edit3, PlusCircle, Trash2, Network } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { initialPanelSettings, type XrayInboundSetting } from "@/app/users/user-data";
import { InboundFormDialog } from "./inbound-form-dialog";
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
} from "@/components/ui/alert-dialog"


export function XrayInboundsCard() {
  const { toast } = useToast();
  const [inbounds, setInbounds] = React.useState<XrayInboundSetting[]>(initialPanelSettings.xrayInbounds);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingInbound, setEditingInbound] = React.useState<XrayInboundSetting | null>(null);
  const [inboundToDelete, setInboundToDelete] = React.useState<XrayInboundSetting | null>(null);


  const handleAddInbound = () => {
    setEditingInbound(null);
    setIsFormOpen(true);
  };

  const handleEditInbound = (inbound: XrayInboundSetting) => {
    setEditingInbound(inbound);
    setIsFormOpen(true);
  };

  const handleDeleteInbound = () => {
    if (!inboundToDelete) return;
    setInbounds(inbounds.filter(ib => ib.id !== inboundToDelete.id));
    toast({
      title: "Inbound Deleted",
      description: `Inbound "${inboundToDelete.tag}" has been deleted (mocked).`,
      variant: "destructive"
    });
    setInboundToDelete(null);
  };

  const handleSaveInbound = (inboundData: XrayInboundSetting) => {
    if (editingInbound) {
      setInbounds(inbounds.map(ib => ib.id === inboundData.id ? inboundData : ib));
      toast({
        title: "Inbound Updated",
        description: `Inbound "${inboundData.tag}" has been updated (mocked).`,
      });
    } else {
      const newInbound = { ...inboundData, id: `inbound_${Date.now()}` };
      setInbounds([newInbound, ...inbounds]);
      toast({
        title: "Inbound Added",
        description: `Inbound "${newInbound.tag}" has been added (mocked).`,
      });
    }
    setIsFormOpen(false);
    setEditingInbound(null);
  };

  const handleToggleInboundEnabled = (inboundId: string) => {
    setInbounds(inbounds.map(ib => 
      ib.id === inboundId ? { ...ib, isEnabled: !ib.isEnabled } : ib
    ));
    const toggledInbound = inbounds.find(ib => ib.id === inboundId);
    if (toggledInbound) {
         toast({
            title: `Inbound ${!toggledInbound.isEnabled ? "Enabled" : "Disabled"}`,
            description: `Inbound "${toggledInbound.tag}" is now ${!toggledInbound.isEnabled ? "enabled" : "disabled"}.`,
        });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center">
             <Network className="mr-2 h-6 w-6 text-primary"/> Xray Inbound Configuration
          </CardTitle>
          <CardDescription className="font-body">
            Manage inbound connections for your Xray-core instance. Add, edit, or remove specific Xray inbounds.
            Advanced settings like host routing, camouflage, muxing, and detailed security parameters are configured within the JSON settings of each inbound.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-end">
            <Button onClick={handleAddInbound} className="font-body">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Inbound
            </Button>
          </div>
          {inbounds.length > 0 ? (
            <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-body">Tag</TableHead>
                  <TableHead className="font-body">Port</TableHead>
                  <TableHead className="font-body">Protocol</TableHead>
                  <TableHead className="font-body text-center">Status</TableHead>
                  <TableHead className="font-body text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inbounds.map((inbound) => (
                  <TableRow key={inbound.id}>
                    <TableCell className="font-medium font-body">{inbound.tag}</TableCell>
                    <TableCell className="font-body">{inbound.port}</TableCell>
                    <TableCell className="font-body">
                        <Badge variant="secondary">{inbound.protocol.toUpperCase()}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={inbound.isEnabled}
                        onCheckedChange={() => handleToggleInboundEnabled(inbound.id)}
                        aria-label={`Toggle inbound ${inbound.tag}`}
                        className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
                      />
                       <span className="ml-2 text-xs font-body">{inbound.isEnabled ? "Enabled" : "Disabled"}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEditInbound(inbound)} title="Edit Inbound">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                       <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="ghost" size="icon" title="Delete Inbound" onClick={() => setInboundToDelete(inbound)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the inbound configuration for "{inboundToDelete?.tag}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setInboundToDelete(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteInbound} className={buttonVariants({variant: "destructive"})}>Delete</AlertDialogAction>
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
            <p className="text-sm text-muted-foreground font-body text-center py-4">No Xray inbounds configured yet.</p>
          )}
        </CardContent>
      </Card>

      {isFormOpen && (
        <InboundFormDialog
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingInbound(null);
          }}
          onSave={handleSaveInbound}
          inboundData={editingInbound}
        />
      )}
    </>
  );
}

// Helper for delete button variant (not strictly necessary here as Tailwind handles destructive variant, but good practice)
const buttonVariants = ({variant}: {variant?: "destructive" | string | null}) => {
    if (variant === "destructive") {
        return "bg-destructive text-destructive-foreground hover:bg-destructive/90";
    }
    return "";
}


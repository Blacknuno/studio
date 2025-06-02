
"use client";

import QRCode from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QrCodeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  title?: string;
  description?: string;
}

export function QrCodeDialog({
  isOpen,
  onClose,
  value,
  title = "Scan QR Code",
  description = "Scan this code with your client application.",
}: QrCodeDialogProps) {
  const { toast } = useToast();

  const handleCopyValue = () => {
    navigator.clipboard.writeText(value)
      .then(() => {
        toast({ title: "Copied!", description: "The link has been copied to your clipboard." });
      })
      .catch(err => {
        toast({ variant: "destructive", title: "Copy Failed", description: "Could not copy the link." });
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline">{title}</DialogTitle>
          {description && <DialogDescription className="font-body">{description}</DialogDescription>}
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-6">
          {value ? (
            <QRCode
              value={value}
              size={256}
              level="H" // High error correction
              imageSettings={{
                src: "/icon.svg", // Optional: embed a small logo in the center
                height: 40,
                width: 40,
                excavate: true,
              }}
              renderAs="svg"
              className="rounded-lg shadow-md"
            />
          ) : (
            <p className="text-muted-foreground font-body">No data to display QR code.</p>
          )}
        </div>
         {value && (
          <div className="mt-2 space-y-2 px-2">
            <label htmlFor="qrLink" className="text-sm font-medium font-body text-muted-foreground">
              Or copy the link:
            </label>
            <div className="flex items-center space-x-2">
              <Input id="qrLink" value={value} readOnly className="font-mono text-xs"/>
              <Button type="button" size="icon" variant="outline" onClick={handleCopyValue}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        <DialogFooter className="mt-6">
          <Button onClick={onClose} className="font-body">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

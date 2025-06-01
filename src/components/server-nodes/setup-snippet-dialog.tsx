
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";

interface SetupSnippetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  nodeName: string;
}

export function SetupSnippetDialog({ isOpen, onClose, nodeName }: SetupSnippetDialogProps) {
  const { toast } = useToast();
  
  const mockSnippet = `
# Mock Setup Snippet for Node: ${nodeName}
# Replace with actual commands for your node setup.

# Example: Docker command
# docker run -d \\
#   --name ${nodeName.toLowerCase().replace(/\s+/g, '-')}-node \\
#   -p YOUR_NODE_PORT:CONTAINER_PORT \\
#   your-proxy-image:latest \\
#   --config /path/to/config.json

echo "Node ${nodeName} setup snippet (mock)."
echo "Panel expects this node to be reachable at its configured address and port."
  `.trim();

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(mockSnippet)
      .then(() => {
        toast({ title: "Copied!", description: "Setup snippet copied to clipboard." });
      })
      .catch(err => {
        toast({ variant: "destructive", title: "Copy Failed", description: "Could not copy snippet." });
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-headline">Setup Snippet for {nodeName}</DialogTitle>
          <DialogDescription className="font-body">
            This is a mock setup snippet. In a real application, this would contain the commands or configuration needed to set up your server node to connect to the panel.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 relative">
          <pre className="bg-muted p-4 rounded-md text-sm font-mono overflow-x-auto max-h-60">
            <code>{mockSnippet}</code>
          </pre>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 h-7 w-7"
            onClick={handleCopySnippet}
            title="Copy Snippet"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter className="mt-2">
          <Button onClick={onClose} className="font-body">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    
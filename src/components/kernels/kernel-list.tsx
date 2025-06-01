
"use client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { kernels } from "@/app/users/user-data"; 
import { Button } from "@/components/ui/button";
import { Github, ExternalLink, Settings2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function KernelList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {kernels.map((kernel) => (
        <Card key={kernel.id} className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Settings2 className="h-6 w-6 text-primary" /> 
                {kernel.name}
              </span>
              {kernel.sourceUrl && (
                <Link href={kernel.sourceUrl} target="_blank" rel="noopener noreferrer" aria-label={`${kernel.name} source link`}>
                  <Button variant="ghost" size="icon">
                    <Github className="h-5 w-5" />
                  </Button>
                </Link>
              )}
            </CardTitle>
            {kernel.description && (
                 <CardDescription className="font-body text-sm">{kernel.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="space-y-2">
                <h4 className="font-medium font-body text-sm">Supported Protocols:</h4>
                <div className="flex flex-wrap gap-2">
                    {kernel.protocols.map(p => (
                        <Badge key={p.name} variant="secondary" className="font-body">{p.label}</Badge>
                    ))}
                </div>
            </div>
            <div className="mt-4">
                 <p className="text-xs text-muted-foreground font-body">
                    {/* Placeholder for kernel-specific settings overview or description */}
                    Specific settings for this kernel can be managed here.
                    {kernel.name === "Xray-core" && " (e.g., compatible with 3x-ui panel configurations)"}
                </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full font-body" disabled>
              <ExternalLink className="mr-2 h-4 w-4" />
              Configure Settings (Coming Soon)
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

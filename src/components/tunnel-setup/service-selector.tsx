
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Route, ShieldQuestion, ShieldAlert } from "lucide-react"; // Using ShieldAlert for Tor as placeholder

type TunnelService = "tor" | "warp" | "psiphon";

interface ServiceSelectorProps {
  onSelectService: (service: TunnelService) => void;
}

const services: { id: TunnelService; name: string; description: string; icon: React.ElementType }[] = [
  {
    id: "tor",
    name: "Tor",
    description: "Route your traffic through the Tor network for anonymity.",
    icon: ShieldAlert, // Placeholder, consider a more Tor-specific icon if available
  },
  {
    id: "warp",
    name: "Warp",
    description: "Use Cloudflare Warp for a faster and more private internet.",
    icon: ShieldQuestion,
  },
  {
    id: "psiphon",
    name: "Psiphon",
    description: "Utilize Psiphon for censorship circumvention.",
    icon: Route,
  },
];

export function ServiceSelector({ onSelectService }: ServiceSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">Select a Tunnel Service</CardTitle>
        <CardDescription className="font-body">
          Choose the type of tunnel you'd like to configure.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {services.map((service) => (
          <Button
            key={service.id}
            variant="outline"
            className="w-full h-auto p-4 flex items-start justify-start text-left space-x-3 hover:bg-accent/50"
            onClick={() => onSelectService(service.id)}
          >
            <service.icon className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-headline text-lg font-semibold">{service.name}</h3>
              <p className="text-sm text-muted-foreground font-body">{service.description}</p>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}

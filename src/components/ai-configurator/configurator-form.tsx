
"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import {
  suggestProtocolConfiguration,
  type SuggestProtocolConfigurationInput,
  type SuggestProtocolConfigurationOutput,
} from "@/ai/flows/suggest-protocol-configuration";

const supportedProtocolsList = [
  { id: "openvpn", label: "OpenVPN" },
  { id: "wireguard", label: "WireGuard" },
  { id: "xray", label: "Xray-core" },
  { id: "sing-box", label: "Sing-box" },
];

const formSchema = z.object({
  networkConditions: z.string().min(10, "Please describe network conditions in more detail."),
  supportedProtocols: z.array(z.string()).min(1, "Please select at least one protocol."),
});

type FormData = z.infer<typeof formSchema>;

export function ConfiguratorForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<SuggestProtocolConfigurationOutput | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      networkConditions: "",
      supportedProtocols: ["wireguard"],
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setSuggestion(null);
    try {
      const result = await suggestProtocolConfiguration(data);
      setSuggestion(result);
      toast({
        title: "Configuration Suggested",
        description: "AI has provided a new configuration suggestion.",
      });
    } catch (error) {
      console.error("Error getting suggestion:", error);
      toast({
        title: "Error",
        description: "Failed to get configuration suggestion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl">AI Protocol Configurator</CardTitle>
          <CardDescription className="font-body">
            Describe your network conditions and select supported protocols. Our AI will suggest an optimal configuration.
          </CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="networkConditions" className="font-body">Network Conditions</Label>
              <Textarea
                id="networkConditions"
                {...form.register("networkConditions")}
                placeholder="e.g., High latency, low bandwidth, focus on security..."
                className="min-h-[100px] font-body"
              />
              {form.formState.errors.networkConditions && (
                <p className="text-sm text-destructive">{form.formState.errors.networkConditions.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="font-body">Supported Protocols</Label>
              <Controller
                name="supportedProtocols"
                control={form.control}
                render={({ field }) => (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {supportedProtocolsList.map((protocol) => (
                      <div key={protocol.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={protocol.id}
                          checked={field.value?.includes(protocol.label)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...(field.value || []), protocol.label])
                              : field.onChange(
                                  (field.value || []).filter(
                                    (value) => value !== protocol.label
                                  )
                                );
                          }}
                        />
                        <Label htmlFor={protocol.id} className="font-body font-normal">{protocol.label}</Label>
                      </div>
                    ))}
                  </div>
                )}
              />
              {form.formState.errors.supportedProtocols && (
                <p className="text-sm text-destructive">{form.formState.errors.supportedProtocols.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="font-body">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suggesting...
                </>
              ) : (
                "Get Suggestion"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {suggestion && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-xl">AI Suggestion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-headline text-lg font-semibold">Suggested Configuration:</h3>
              <pre className="mt-1 whitespace-pre-wrap rounded-md bg-muted p-4 text-sm font-code">
                {suggestion.suggestedConfiguration}
              </pre>
            </div>
            <div>
              <h3 className="font-headline text-lg font-semibold">Reasoning:</h3>
              <p className="mt-1 rounded-md bg-muted p-4 text-sm font-body">
                {suggestion.reasoning}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


"use client";

import * as React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { ServiceSelector } from "@/components/tunnel-setup/service-selector";
import { CountrySelector } from "@/components/tunnel-setup/country-selector";
import { WarpLicenseValidator } from "@/components/tunnel-setup/warp-license-validator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { availableCountries, type Country } from "@/app/users/user-data";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";

type TunnelService = "tor" | "warp" | "psiphon";
type Step = "service" | "license" | "countries" | "confirm";

const serviceDisplayNames: Record<TunnelService, string> = {
  tor: "Tor",
  warp: "Warp",
  psiphon: "Psiphon",
};

export default function TunnelSetupPage() {
  const [currentStep, setCurrentStep] = React.useState<Step>("service");
  const [selectedService, setSelectedService] = React.useState<TunnelService | null>(null);
  const [selectedCountries, setSelectedCountries] = React.useState<string[]>([]);
  const [isWarpLicenseValid, setIsWarpLicenseValid] = React.useState<boolean>(false);
  const [isActivating, setIsActivating] = React.useState<boolean>(false);
  const { toast } = useToast();

  const handleServiceSelect = (service: TunnelService) => {
    setSelectedService(service);
    if (service === "warp") {
      setCurrentStep("license");
    } else {
      setCurrentStep("countries");
    }
  };

  const handleLicenseValidated = () => {
    setIsWarpLicenseValid(true);
    setCurrentStep("countries");
  };

  const handleCountriesConfirm = (countries: string[]) => {
    setSelectedCountries(countries);
    setCurrentStep("confirm");
  };

  const handleActivateTunnel = () => {
    setIsActivating(true);
    // Mock activation
    setTimeout(() => {
      toast({
        title: "Tunnel Activated (Mock)",
        description: `Your ${selectedService ? serviceDisplayNames[selectedService] : ''} tunnel with ${selectedCountries.length} countries has been activated.`,
      });
      setIsActivating(false);
      resetFlow();
    }, 1500);
  };
  
  const resetFlow = () => {
    setCurrentStep("service");
    setSelectedService(null);
    setSelectedCountries([]);
    setIsWarpLicenseValid(false);
  };

  const goBack = () => {
    if (currentStep === "confirm") setCurrentStep("countries");
    else if (currentStep === "countries") {
      if (selectedService === "warp") setCurrentStep("license");
      else setCurrentStep("service");
    }
    else if (currentStep === "license") setCurrentStep("service");
  };

  const getSelectedCountryNames = (): Country[] => {
    return availableCountries.filter(ac => selectedCountries.includes(ac.code));
  };

  return (
    <AppLayout>
      <div className="space-y-8 max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-headline font-semibold">Tunnel Setup</h1>
            {currentStep !== 'service' && (
                <Button variant="outline" onClick={goBack} size="sm">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
            )}
        </div>

        {currentStep === "service" && (
          <ServiceSelector onSelectService={handleServiceSelect} />
        )}

        {currentStep === "license" && selectedService === "warp" && (
          <WarpLicenseValidator onLicenseValidated={handleLicenseValidated} />
        )}

        {currentStep === "countries" && selectedService && (
          <CountrySelector
            serviceName={serviceDisplayNames[selectedService]}
            onConfirmCountries={handleCountriesConfirm}
            initialSelectedCountries={selectedCountries}
          />
        )}

        {currentStep === "confirm" && selectedService && (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">Confirm Tunnel Configuration</CardTitle>
              <CardDescription className="font-body">
                Please review your tunnel setup before activation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold font-body">Selected Service:</h3>
                <p className="font-body text-lg text-primary">{serviceDisplayNames[selectedService]}</p>
              </div>
              <div>
                <h3 className="font-semibold font-body">Selected Countries ({selectedCountries.length}):</h3>
                {selectedCountries.length > 0 ? (
                  <ul className="list-disc list-inside font-body space-y-1 mt-1">
                    {getSelectedCountryNames().map(c => (
                        <li key={c.code}>{c.flag} {c.name}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="font-body text-muted-foreground">No countries selected.</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={goBack} disabled={isActivating}>
                    Edit Selection
                </Button>
                <Button onClick={handleActivateTunnel} disabled={isActivating}>
                {isActivating ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Activating...
                    </>
                ) : (
                    <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Activate Tunnel
                    </>
                )}
                </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}

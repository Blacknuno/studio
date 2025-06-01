
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { initialPanelSettings, filterableCountries, type Country } from "@/app/users/user-data";
import { Ban, Globe } from "lucide-react";

export function CountryBlockingCard() {
  const { toast } = useToast();
  const [selectedCountries, setSelectedCountries] = React.useState<string[]>(
    initialPanelSettings.blockedCountries || []
  );

  const handleCountryToggle = (countryCode: string) => {
    setSelectedCountries((prev) =>
      prev.includes(countryCode)
        ? prev.filter((code) => code !== countryCode)
        : [...prev, countryCode]
    );
  };

  const handleSaveChanges = () => {
    // In a real app, you'd save these to a backend and apply blocking rules.
    console.log("Saving blocked countries:", selectedCountries);
    // Update mock global state (for demonstration if needed elsewhere, not robust)
    initialPanelSettings.blockedCountries = selectedCountries; 
    toast({
      title: "Country Blocking Settings Saved",
      description: "Your geo-blocking preferences have been updated (mocked).",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center">
          <Ban className="mr-2 h-6 w-6 text-primary"/> Geo-Blocking / Country Filtering
        </CardTitle>
        <CardDescription className="font-body">
          Select countries to block access from. This can help mitigate specific threats or comply with regional restrictions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="font-body text-base">Select Countries to Block:</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 border rounded-md">
            {filterableCountries.map((country: Country) => (
              <div key={country.code} className="flex items-center space-x-2">
                <Checkbox
                  id={`block-${country.code}`}
                  checked={selectedCountries.includes(country.code)}
                  onCheckedChange={() => handleCountryToggle(country.code)}
                />
                <Label
                  htmlFor={`block-${country.code}`}
                  className="font-body font-normal flex items-center"
                >
                  <span className="mr-2 text-lg">{country.flag}</span>
                  {country.name} ({country.code})
                </Label>
              </div>
            ))}
          </div>
           <p className="text-xs text-muted-foreground font-body">
            Blocking countries will prevent IPs and domains associated with the selected regions from accessing services managed by this panel.
          </p>
        </div>

        <div className="flex justify-end">
            <Button onClick={handleSaveChanges} className="font-body">Save Blocking Settings</Button>
        </div>
      </CardContent>
    </Card>
  );
}

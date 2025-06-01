
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
import { Ban, Globe, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export function CountryBlockingCard() {
  const { toast } = useToast();
  const [selectedCountries, setSelectedCountries] = React.useState<string[]>(
    initialPanelSettings.blockedCountries || []
  );
  const [lastBlockedCountry, setLastBlockedCountry] = React.useState<Country | null>(null);

  const handleCountryToggle = (country: Country) => {
    const countryCode = country.code;
    setSelectedCountries((prev) => {
      const isCurrentlySelected = prev.includes(countryCode);
      if (isCurrentlySelected) {
        setLastBlockedCountry(null); // Clear if unselected
        return prev.filter((code) => code !== countryCode);
      } else {
        setLastBlockedCountry(country); // Set if selected
        return [...prev, countryCode];
      }
    });
  };

  const handleSaveChanges = () => {
    initialPanelSettings.blockedCountries = selectedCountries; 
    console.log("Saving blocked countries:", selectedCountries);
    toast({
      title: "Country Blocking Settings Saved",
      description: `${selectedCountries.length} ${selectedCountries.length === 1 ? 'country' : 'countries'} are now in the block list (mocked).`,
    });
    if (lastBlockedCountry) {
        // This toast is more for immediate feedback upon checking a box,
        // but we can reiterate on save if needed.
        // For now, the primary toast is the general save confirmation.
    }
    setLastBlockedCountry(null); // Reset after save
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center">
          <Ban className="mr-2 h-6 w-6 text-primary"/> Geo-Blocking / Country Filtering
        </CardTitle>
        <CardDescription className="font-body">
          Select countries to block access from. This can help mitigate specific threats or comply with regional restrictions.
          A full interactive map is a complex UI feature; for now, selections are made via the list below.
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
                  onCheckedChange={() => handleCountryToggle(country)}
                />
                <Label
                  htmlFor={`block-${country.code}`}
                  className={cn(
                    "font-body font-normal flex items-center",
                    selectedCountries.includes(country.code) && "text-destructive font-semibold"
                  )}
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

        {lastBlockedCountry && (
          <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <p className="text-sm font-medium text-destructive">
              {lastBlockedCountry.flag} {lastBlockedCountry.name} ({lastBlockedCountry.code}) has been selected for blocking. Save changes to apply.
            </p>
          </div>
        )}


        <div className="flex justify-end">
            <Button onClick={handleSaveChanges} className="font-body">Save Blocking Settings</Button>
        </div>
      </CardContent>
    </Card>
  );
}

    
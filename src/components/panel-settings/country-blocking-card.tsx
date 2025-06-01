
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
import { useToast } from "@/hooks/use-toast";
import { initialPanelSettings, filterableCountries, type Country } from "@/app/users/user-data";
import { Ban, AlertTriangle, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { VectorMap } from "@react-jvectormap/core";
import { worldMill } from "@react-jvectormap/world";


export function CountryBlockingCard() {
  const { toast } = useToast();
  const [selectedCountries, setSelectedCountries] = React.useState<string[]>(
    initialPanelSettings.blockedCountries || []
  );
  const [lastToggledCountry, setLastToggledCountry] = React.useState<Country | null>(null);
  const [lastAction, setLastAction] = React.useState<"blocked" | "unblocked" | null>(null);

  const handleRegionClick = (event: any, countryCode: string) => {
    const country = filterableCountries.find(c => c.code === countryCode);
    // Only allow toggling for predefined filterable countries
    if (!country && !selectedCountries.includes(countryCode)) {
        toast({
            variant: "default",
            title: "Country Not Filterable",
            description: `The selected region (${countryCode}) is not in the predefined list for blocking.`,
        });
        return;
    }
    
    setLastToggledCountry(country || {code: countryCode, name: countryCode, flag: '🏳️'}); // Use countryCode as name if not in filterable list but was selected

    setSelectedCountries((prev) => {
      const isCurrentlySelected = prev.includes(countryCode);
      if (isCurrentlySelected) {
        setLastAction("unblocked");
        return prev.filter((code) => code !== countryCode);
      } else {
        setLastAction("blocked");
        return [...prev, countryCode];
      }
    });
  };

  const handleSaveChanges = () => {
    initialPanelSettings.blockedCountries = selectedCountries; 
    console.log("Saving blocked countries:", selectedCountries);
    toast({
      title: "Country Blocking Settings Saved",
      description: `${selectedCountries.length} ${selectedCountries.length === 1 ? 'country is' : 'countries are'} now in the block list (mocked).`,
    });
    setLastToggledCountry(null);
    setLastAction(null);
  };

  // Convert selected country codes to an object for jVectorMap `selectedRegions`
  const selectedRegionsForMap = React.useMemo(() => {
    return selectedCountries.reduce((acc, code) => {
      acc[code] = true;
      return acc;
    }, {} as Record<string, boolean>);
  }, [selectedCountries]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center">
          <Ban className="mr-2 h-6 w-6 text-primary"/> Geo-Blocking / Country Filtering
        </CardTitle>
        <CardDescription className="font-body">
          Select countries on the map to block access from. This can help mitigate specific threats or comply with regional restrictions.
          Only countries from a predefined filterable list can be effectively managed through this interface for blocking.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="w-full h-[300px] md:h-[400px] border rounded-md p-2 bg-muted/30">
          <VectorMap
            map={worldMill}
            backgroundColor="transparent"
            containerStyle={{
              width: "100%",
              height: "100%",
            }}
            regionStyle={{
              initial: {
                fill: "hsl(var(--muted-foreground))", // Muted color for non-selected countries
                fillOpacity: 0.7,
                stroke: "hsl(var(--background))",
                strokeWidth: 0.5,
                strokeOpacity: 0.5,
              },
              hover: {
                fillOpacity: 1,
                cursor: 'pointer',
                 fill: "hsl(var(--accent))",
              },
              selected: {
                fill: "hsl(var(--destructive))", // Red for selected (blocked) countries
              },
              selectedHover: {
                 fill: "hsl(var(--destructive))",
                 fillOpacity: 0.8,
              },
            }}
            regionsSelectable={true}
            selectedRegions={selectedRegionsForMap}
            onRegionClick={handleRegionClick}
            series={{
                regions: [
                    {
                        values: filterableCountries.reduce((acc, c) => ({...acc, [c.code]: 'hsl(var(--primary))'}), {}), // Highlight filterable countries
                        attribute: 'fill',
                    }
                ]
            }}
          />
        </div>
        <div className="flex items-center space-x-2 min-h-[40px]">
            {lastToggledCountry && lastAction && (
            <div className={cn("p-3 rounded-md flex items-center space-x-2 text-sm font-medium w-full",
                lastAction === "blocked" ? "bg-destructive/10 border border-destructive/30 text-destructive" : "bg-blue-500/10 border border-blue-500/30 text-blue-700 dark:text-blue-400"
            )}>
                <AlertTriangle className="h-5 w-5" />
                <p>
                {lastToggledCountry.flag} {lastToggledCountry.name} ({lastToggledCountry.code}) has been {lastAction === "blocked" ? "selected for blocking" : "deselected"}. Save changes to apply.
                </p>
            </div>
            )}
        </div>
         <p className="text-xs text-muted-foreground font-body">
            <strong>Note:</strong> Clicking on a country toggles its selection for blocking. Blocked countries will appear in red. Countries highlighted in the theme's primary color are part of the predefined filterable list.
            Saving changes will (mock) apply these blocking rules.
        </p>
        <div className="flex justify-end">
            <Button onClick={handleSaveChanges} className="font-body">Save Blocking Settings</Button>
        </div>
      </CardContent>
    </Card>
  );
}

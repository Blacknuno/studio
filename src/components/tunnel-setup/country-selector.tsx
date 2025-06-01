
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { availableCountries, type Country } from "@/app/users/user-data";
import { Globe } from "lucide-react";

interface CountrySelectorProps {
  serviceName: string;
  onConfirmCountries: (selectedCountries: string[]) => void;
  initialSelectedCountries?: string[];
}

export function CountrySelector({ serviceName, onConfirmCountries, initialSelectedCountries = [] }: CountrySelectorProps) {
  const [selected, setSelected] = React.useState<string[]>(initialSelectedCountries);

  const handleToggleCountry = (countryCode: string) => {
    setSelected((prev) =>
      prev.includes(countryCode)
        ? prev.filter((code) => code !== countryCode)
        : [...prev, countryCode]
    );
  };

  const handleSubmit = () => {
    onConfirmCountries(selected);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">Select Countries for {serviceName}</CardTitle>
        <CardDescription className="font-body">
          Choose the countries through which your {serviceName} tunnel will route traffic or connect to.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72 w-full rounded-md border p-4">
          <div className="space-y-3">
            {availableCountries.map((country) => (
              <div key={country.code} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                <Checkbox
                  id={`country-${country.code}`}
                  checked={selected.includes(country.code)}
                  onCheckedChange={() => handleToggleCountry(country.code)}
                />
                <Label htmlFor={`country-${country.code}`} className="flex items-center cursor-pointer font-body">
                  <span className="mr-2 text-lg">{country.flag}</span>
                  {country.name} ({country.code})
                </Label>
              </div>
            ))}
            {availableCountries.length === 0 && (
                <p className="text-muted-foreground text-center font-body">No countries available for selection.</p>
            )}
          </div>
        </ScrollArea>
        <p className="text-sm text-muted-foreground mt-3 font-body">
            You have selected {selected.length} {selected.length === 1 ? "country" : "countries"}.
        </p>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSubmit} className="font-body">
            <Globe className="mr-2 h-4 w-4" /> Confirm Countries
        </Button>
      </CardFooter>
    </Card>
  );
}

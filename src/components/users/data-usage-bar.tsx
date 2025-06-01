
"use client";

import { cn } from "@/lib/utils";

interface DataUsageBarProps {
  used: number;
  allowance: number;
}

export function DataUsageBar({ used, allowance }: DataUsageBarProps) {
  if (allowance <= 0) { // Handle cases with no allowance or invalid allowance
    return (
      <div className="w-full flex flex-col items-center">
        <div className="h-2.5 w-full bg-muted rounded-full">
           <div className={cn("h-full rounded-full", used > 0 ? "bg-destructive" : "bg-muted")} style={{ width: `100%` }} />
        </div>
        <div className="text-xs mt-1 flex justify-between w-full px-1">
          <span>{used > 0 ? `${used.toFixed(1)} GB Used` : 'N/A'}</span>
          {used > 0 && allowance <=0 && <span className="text-destructive font-medium">Error</span> }
        </div>
      </div>
    );
  }

  const clampedUsed = Math.max(0, Math.min(used, allowance)); // Ensure used doesn't exceed allowance for bar
  const percentage = (clampedUsed / allowance) * 100;
  const remainingGB = allowance - used; // Use original 'used' for status text

  let barFillClass = "bg-primary"; // Default Green (theme primary)
  let statusText = "";
  let statusTextColorClass = "text-muted-foreground";


  if (used >= allowance) { // Used full allowance or more
    barFillClass = "bg-destructive"; 
    statusText = "Full";
    statusTextColorClass = "text-destructive";
  } else if (remainingGB <= 1) {
    barFillClass = "bg-destructive"; 
    statusText = "Critical";
    statusTextColorClass = "text-destructive";
  } else if (remainingGB <= 5) {
    barFillClass = "bg-yellow-500"; // Using a direct yellow
    statusText = "Low";
    statusTextColorClass = "text-yellow-600";
  }


  return (
    <div className="w-full flex flex-col items-center" title={`Used: ${used.toFixed(1)}GB, Allowance: ${allowance}GB, Remaining: ${Math.max(0, allowance - used).toFixed(1)}GB`}>
      <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-l-full transition-all duration-300 ease-in-out", barFillClass, percentage === 100 ? "rounded-r-full" : "")}
          style={{ width: `${percentage}%` }}
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
        />
      </div>
      <div className="text-xs mt-1 flex justify-between w-full px-0.5">
        <span>{used.toFixed(1)}/{allowance} GB</span>
        {statusText && <span className={cn("font-medium", statusTextColorClass)}>{statusText}</span>}
      </div>
    </div>
  );
}


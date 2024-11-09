import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Play, Calendar } from "lucide-react";

interface StartScheduleButtonProps {
  onStartInstant: () => void;
  onSchedule: () => void;
}

export default function StartScheduleButton({
  onStartInstant,
  onSchedule,
}: StartScheduleButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-between">
          Schedule Interview
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        <DropdownMenuItem onClick={onStartInstant}>
          <Play className="mr-2 h-4 w-4" />
          <span>Start Instant Interview</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onSchedule}>
          <Calendar className="mr-2 h-4 w-4" />
          <span>Schedule Interview</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

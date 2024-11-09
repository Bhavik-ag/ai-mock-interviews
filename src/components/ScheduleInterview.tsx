"use client";

import React, { useState, useEffect, useCallback } from "react";
import { CalendarIcon, Clock, CheckCircle } from "lucide-react";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Interview } from "@/app/types";
import StartScheduleButton from "@/views/InterviewView/components/StartScheduleButton";

const INTERVIEW_TITLE = "Google Coding Round 1";

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

const formSchema = z.object({
  date: z.date({
    required_error: "Please select a date.",
  }),
  hours: z.string().nonempty("Please select the hour."),
  minutes: z.string().nonempty("Please select the minutes."),
  period: z.enum(["AM", "PM"], {
    required_error: "Please select AM or PM.",
  }),
});

type FormData = z.infer<typeof formSchema>;

interface ScheduleInterviewProps {
  interview: Interview;
}

export default function ScheduleInterview({
  interview,
}: ScheduleInterviewProps) {
  const [date, setDate] = useState<Date>();
  const [hours, setHours] = useState<string>("");
  const [minutes, setMinutes] = useState<string>("");
  const [period, setPeriod] = useState<"AM" | "PM">("AM");
  const [isScheduled, setIsScheduled] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isOpen, setIsOpen] = useState(false);

  const handleScheduleInterview = useCallback(async () => {
    const fetchResult = await fetch("/api/schedule-interview", {
      method: "POST",
      body: JSON.stringify({
        interviewId: interview.id,
        interviewSlug: interview.slug,
        date,
      }),
    });
    const data = await fetchResult.json();
    console.log("Interview scheduled!", data);
    setIsScheduled(true);
  }, [interview, date]);

  const handleSchedule = useCallback(() => {
    console.log("Handling schedule...");
    const formData: FormData = { date, hours, minutes, period } as FormData;

    try {
      formSchema.parse(formData);
      handleScheduleInterview();
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.formErrors.fieldErrors);
      }
    }
  }, [date, hours, minutes, period, handleScheduleInterview]);

  const handleStartInstant = useCallback(async () => {
    const fetchResult = await fetch("/api/schedule-interview", {
      method: "POST",
      body: JSON.stringify({
        interviewId: interview.id,
        interviewSlug: interview.slug,
        date: null,
      }),
    });
    const data = await fetchResult.json();
    console.log("instant interview", data);
    window.location.href = data.interviewUrl;
  }, []);

  const handleOpenSchedule = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    console.log("Closing dialog");
    setIsOpen(false);
    setIsScheduled(false);
    setDate(undefined);
    setHours("");
    setMinutes("");
    setPeriod("AM");
    setErrors({});
  }, []);

  useEffect(() => {
    console.log("Dialog open state:", isOpen);

    return () => {
      console.log("Cleaning up...");
      // Perform any necessary cleanup here
    };
  }, [isOpen]);

  return (
    <>
      <StartScheduleButton
        onStartInstant={handleStartInstant}
        onSchedule={handleOpenSchedule}
      />
      <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{INTERVIEW_TITLE}</DialogTitle>
          </DialogHeader>
          {!isScheduled ? (
            <>
              <div className="grid gap-6 py-4">
                <div className="flex items-center gap-4">
                  <CalendarIcon className="h-4 w-4 opacity-50" />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                          "w-[280px] justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        {date ? formatDate(date) : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(newDate) => {
                          setDate(newDate);
                          // Close the popover after selection
                          const popoverTrigger =
                            document.getElementById("date");
                          if (popoverTrigger) {
                            popoverTrigger.click();
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                {errors.date && (
                  <p className="text-sm text-red-500">{errors.date as any}</p>
                )}
                <div className="flex items-center gap-4">
                  <Clock className="h-4 w-4 opacity-50" />
                  <div className="flex items-center space-x-2">
                    <Select
                      onValueChange={(hour) => {
                        date?.setHours(parseInt(hour));
                        setHours(hour);
                      }}
                    >
                      <SelectTrigger className="w-[70px]">
                        <SelectValue placeholder="HH" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                          (hour) => (
                            <SelectItem
                              key={hour}
                              value={hour.toString().padStart(2, "0")}
                            >
                              {hour.toString().padStart(2, "0")}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <span>:</span>
                    <Select
                      onValueChange={(minute) => {
                        date?.setMinutes(parseInt(minute));
                        setMinutes(minute);
                      }}
                    >
                      <SelectTrigger className="w-[70px]">
                        <SelectValue placeholder="MM" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 60 }, (_, i) => i).map(
                          (minute) => (
                            <SelectItem
                              key={minute}
                              value={minute.toString().padStart(2, "0")}
                            >
                              {minute.toString().padStart(2, "0")}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <ToggleGroup
                      type="single"
                      value={period}
                      onValueChange={(value) => {
                        setPeriod(value as "AM" | "PM");
                        date?.setHours(
                          value === "AM"
                            ? date.getHours() % 12
                            : (date.getHours() % 12) + 12
                        );
                      }}
                    >
                      <ToggleGroupItem
                        value="AM"
                        aria-label="Set AM"
                        className="px-3"
                      >
                        AM
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="PM"
                        aria-label="Set PM"
                        className="px-3"
                      >
                        PM
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </div>
                {(errors.hours || errors.minutes || errors.period) && (
                  <p className="text-sm text-red-500">
                    Please select a valid time.
                  </p>
                )}
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleSchedule}>
                  Schedule
                </Button>
              </DialogFooter>
            </>
          ) : (
            <div className="py-6 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-lg font-semibold mb-2">Interview Scheduled!</p>
              <p>
                An email has been sent to you with the details to join the
                interview.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

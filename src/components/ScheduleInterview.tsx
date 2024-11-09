"use client";

import { useState } from "react";
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
  DialogTrigger,
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
import { sendMail } from "@/utils/resend";
import supabaseBrowserClient from "@/lib/supabase/client";

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

  const SendLinkToMail = async (to: string, link: string): Promise<boolean> => {
    const emailTemplate = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Interview Scheduled - Fleqo</title>
        <style>
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
          }
          .header {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-bottom: 3px solid hsl(157.9, 87.7%, 58.6%);
          }
          .content {
            padding: 30px 20px;
            background-color: #ffffff;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: hsl(157.9, 87.7%, 58.6%);
            color: #ffffff;
            text-decoration: none;
            border-radius: 4px;
            margin: 20px 0;
            font-weight: bold;
          }
          .button:hover {
            background-color: hsl(157.9, 87.7%, 48.6%);
          }
          .footer {
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666666;
            background-color: #f8f9fa;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1 style="color: hsl(157.9, 87.7%, 58.6%); margin: 0;">Interview Scheduled</h1>
          </div>
          <div class="content">
            <p>Dear Candidate,</p>
            <p>Thank you for your interest in joining our team at Fleqo. We're excited to inform you that your interview has been scheduled.</p>
            <p>To view your interview details and join the session when it's time, please click the button below:</p>
            <div style="text-align: center;">
              <a href="${link}" class="button">View Interview Details</a>
            </div>
            <p style="color: hsl(157.9, 87.7%, 38.6%); font-weight: bold;">Important Notes:</p>
            <ul>
              <li>Please ensure you have a stable internet connection</li>
              <li>Test your audio and video before the interview</li>
              <li>Keep your resume handy for reference</li>
              <li>Join the interview 5 minutes before the scheduled time</li>
            </ul>
            <p>If you need to reschedule or have any questions, please don't hesitate to contact us.</p>
            <p>Best regards,<br>The Fleqo Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply directly to this message.</p>
            <p>© ${new Date().getFullYear()} Fleqo. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

    try {
      await sendMail({
        to,
        subject: "Your Interview is Scheduled - Fleqo",
        html: emailTemplate,
      });
      console.log("Email sent successfully");
      return true;
    } catch (error) {
      console.error(error, "Error sending email");
      return false;
    }
  };

  const handleScheduleInterview = async () => {
    const fetchResult = await fetch("/api/schedule-interview", {
      method: "POST",
      body: JSON.stringify({
        interviewId: interview.id,
        interviewSlug: interview.slug,
        date,
      }),
    });
    const data = await fetchResult.json();
    if (data.interviewUrl) {
      const email = (await supabaseBrowserClient.auth.getUser()).data.user
        ?.email;
      if (email) {
        const link = `${window.location.origin}/${data.interviewUrl}`;
        await SendLinkToMail(email, link);
      }
    }
  };

  const handleSchedule = () => {
    const formData: FormData = { date, hours, minutes, period } as FormData;

    try {
      formSchema.parse(formData);
      handleScheduleInterview();
      setIsScheduled(true);
      setErrors({});
      setDate(undefined);
      setHours("");
      setMinutes("");
      setPeriod("AM");
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.formErrors.fieldErrors);
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Schedule Interview</Button>
      </DialogTrigger>
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
                        const popoverTrigger = document.getElementById("date");
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
                      {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                        <SelectItem
                          key={minute}
                          value={minute.toString().padStart(2, "0")}
                        >
                          {minute.toString().padStart(2, "0")}
                        </SelectItem>
                      ))}
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
  );
}

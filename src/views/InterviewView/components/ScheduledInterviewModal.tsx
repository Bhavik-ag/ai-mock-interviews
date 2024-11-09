"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, ArrowRight } from "lucide-react";

export default function ScheduledInterviewModal({
  scheduledTime,
  setStartInterview,
}: {
  scheduledTime: Date;
  setStartInterview: (value: boolean) => void;
}) {
  const [timeLeft, setTimeLeft] = useState(
    Math.max(0, scheduledTime.getTime() - new Date().getTime()),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          return 0;
        }
        return Math.max(0, scheduledTime.getTime() - new Date().getTime());
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [scheduledTime]);

  useEffect(() => {
    const totalDuration = scheduledTime.getTime() - new Date().getTime();
  }, [timeLeft, scheduledTime]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleStartInterview = () => {
    setStartInterview(true);
  };

  return (
    <>
      <div className="relative p-6 bg-gradient-to-br from-[#4CF3B5] to-[#36ccb9] text-white">
        <h2 className="text-3xl font-bold mb-2">Get Ready!</h2>
        <p className="text-lg mb-4">Your interview is about to begin</p>
        <div className="flex items-center space-x-2 mb-2">
          <Calendar className="w-5 h-5" />
          <span>{scheduledTime.toLocaleDateString()}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span>Scheduled for {scheduledTime.toLocaleTimeString()}</span>
        </div>
      </div>
      <div className="p-6 bg-white">
        <div className="mb-6">
          <div
            className="text-4xl font-bold text-center mb-2"
            style={{ color: "#4CF3B5" }}
          >
            {formatTime(timeLeft)}
          </div>
        </div>
        <p className="text-center text-sm text-gray-500 mb-6">
          Please ensure you are in a quiet environment with a stable internet
          connection.
        </p>
        <Button
          onClick={handleStartInterview}
          disabled={timeLeft > 0}
          className="w-full bg-[#4CF3B5] hover:bg-[#3ad99f] text-white"
        >
          {timeLeft > 0 ? (
            "Please wait..."
          ) : (
            <>
              Start Interview
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </>
  );
}

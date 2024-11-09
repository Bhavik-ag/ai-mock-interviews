import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { Database } from "@/app/database.types";
import { Button } from "@/components/ui/button";

const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString();
};

type InterviewDetails = Database["public"]["Views"]["interview_details"]["Row"];

export default function Component({
  interviewDetails,
}: {
  interviewDetails: InterviewDetails;
}) {
  return (
    <Card className="w-[49%] border-black">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold mb-2">
              {interviewDetails.title}
            </CardTitle>
            <Badge
              variant={interviewDetails.is_finished ? "default" : "secondary"}
            >
              {interviewDetails.is_finished ? "Completed" : "In Progress"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Scheduled: {formatDate(interviewDetails.scheduled_time)}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <ClockIcon className="mr-2 h-4 w-4" />
              Duration: {interviewDetails.time_taken} /{" "}
              {interviewDetails.max_time} min
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Questions: {interviewDetails.no_of_questions}
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {(interviewDetails.tags || "").split(",").map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag.trim()}
              </Badge>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Question Types</h3>
          <div className="flex flex-wrap gap-2">
            {(interviewDetails.question_types || "")
              .split(",")
              .map((type, index) => (
                <Badge key={index} variant="outline">
                  {type.trim()}
                </Badge>
              ))}
          </div>
        </div>
        <Button className="mt-4" asChild>
          <a
            href={`interview/${interviewDetails.slug}?id=${interviewDetails.user_interview_id}`}
          >
            View Interview
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}

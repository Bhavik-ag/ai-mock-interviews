"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { type Interview } from "@/app/types";
import { Button } from "./ui/button";
import ScheduleInterviews from "./ScheduleInterview";
const InterviewCard = ({ interview }: { interview: Interview }) => {
  return (
    <Card
      key={interview.id}
      className="hover:bg-muted min-w-[400px] justify-between flex flex-col"
    >
      <CardHeader>
        <CardTitle className="text-lg">{interview.title}</CardTitle>

        <span className="text-xs w-3/4 leading-normal">
          <p className="text-sm">
            The Goldman Sachs Summer Analyst Interview is a highly competitive
            process designed to evaluate your skills, knowledge, and fit for the
            firm&apos;s culture. Here’s what you can expect and aim to achieve:
          </p>
          <br />
          <ul className="text-sm list-disc pl-4">
            <li>DSA questions to test your problem-solving skills.</li>
            <li>
              Opportunity to demonstrate your technical skills and knowledge.
            </li>
            <li>Time management and communication skills.</li>
          </ul>
        </span>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-muted-foreground">Max Time: </span>
            <span>{interview.max_time} min</span>
          </div>
          <ScheduleInterviews interview={interview} />
        </div>
      </CardContent>
    </Card>
  );
};

export default InterviewCard;

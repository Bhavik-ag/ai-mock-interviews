// @ts-nocheck
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DashboardLayout from "@/components/ui/dashboard-layout";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getInterviewsSnap } from "@/lib/supabase/serverside_fetchers";
import { BarChart, Calendar, Clock, Star, Zap } from "lucide-react";

interface Interview {
  id: number;
  title?: string;
  max_time?: number;
  no_of_questions?: number;
  tags?: string;
  question_types?: string;
  slug?: string;
  created_at?: string;
  user_id?: string;
  time_taken?: number | null;
  interview_id?: number;
  is_finished?: boolean;
  scheduled_time?: string;
}

export default async function ProfilePage() {
  const user = await createSupabaseServerClient().auth.getUser();
  const interviewSnap = await getInterviewsSnap(user.data.user?.id || "");

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <Card className="mb-6">
          <CardContent className="flex items-center gap-6 pt-6">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={user.data.user?.user_metadata.picture}
                alt="User's profile picture"
              />
              <AvatarFallback>
                {user.data.user?.user_metadata.full_name
                  .split(" ")
                  .map((name: string) => name[0])}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">
                {user.data.user?.user_metadata.full_name}
              </h1>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Interview Statistics</CardTitle>
              <CardDescription>
                Your performance across all interviews
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-muted-foreground" />
                  <span>Technical Skills</span>
                </div>
                <Progress value={75} className="w-1/2" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span>Communication</span>
                </div>
                <Progress value={85} className="w-1/2" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                  <span>Problem Solving</span>
                </div>
                <Progress value={70} className="w-1/2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interview Summary</CardTitle>
              <CardDescription>Your mock interview activity</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Total Interviews</span>
                </div>
                <span className="text-2xl font-bold">12</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Average Duration</span>
                </div>
                <span className="text-2xl font-bold">45 min</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span>Overall Rating</span>
                </div>
                <span className="text-2xl font-bold">4.2/5</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Interviews</CardTitle>
            <CardDescription>
              Your last 5 mock interviews and insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Key Insight</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {interviewSnap && interviewSnap.filter(
                    (item): item is Interview =>
                      "title" in item && "scheduled_time" in item
                  )
                  .map((interview) => (
                    <TableRow key={interview.id}>
                      <TableCell>
                        {new Date(
                          interview.scheduled_time!
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{interview.title}</TableCell>
                      <TableCell>
                        {interview.time_taken
                          ? `${interview.time_taken} min`
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge>
                          {interview.is_finished ? "Completed" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {interview.is_finished
                          ? "Completed with feedback"
                          : "Pending feedback"}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-center">
          <Button>Schedule Next Interview</Button>
        </div>
      </div>
    </DashboardLayout>
  );
}

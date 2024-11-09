import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/ui/dashboard-layout";
import { Calendar, CheckCircle, Clock } from "lucide-react";
import { format, parseISO, isPast, isFuture } from "date-fns";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getInterviewsSnap } from "@/lib/supabase/serverside_fetchers";

// Types
interface Interview {
  id: number;
  title: string;
  max_time: number;
  no_of_questions: number;
  tags: string;
  question_types: string;
  slug: string;
  created_at: string;
  user_id: string;
  time_taken: number | null;
  interview_id: number;
  is_finished: boolean;
  scheduled_time: string;
}

const DashboardView = async () => {
  const user = await createSupabaseServerClient().auth.getUser();
  const interviewSnap = await getInterviewsSnap(user.data.user?.id || "");

  // Function to format the interview data
  const formatInterviewData = (interviews: Interview[]) => {
    const currentDate = new Date();

    // Separate upcoming and completed interviews
    const upcoming = interviews
      .filter((interview) => {
        const scheduleDate = interview.scheduled_time
          ? parseISO(interview.scheduled_time)
          : null;
        return (
          scheduleDate && scheduleDate > currentDate && !interview.is_finished
        );
      })
      .sort((a, b) => {
        const dateA = a.scheduled_time
          ? parseISO(a.scheduled_time).getTime()
          : 0;
        const dateB = b.scheduled_time
          ? parseISO(b.scheduled_time).getTime()
          : 0;
        return dateA - dateB;
      });

    const completed = interviews
      .filter((interview) => {
        const scheduleDate = interview.scheduled_time
          ? parseISO(interview.scheduled_time)
          : null;
        return (
          interview.is_finished || (scheduleDate && scheduleDate <= currentDate)
        );
      })
      .sort((a, b) => {
        const dateA = a.scheduled_time
          ? parseISO(a.scheduled_time).getTime()
          : 0;
        const dateB = b.scheduled_time
          ? parseISO(b.scheduled_time).getTime()
          : 0;
        return dateB - dateA;
      });

    return { upcoming, completed };
  };

  const { upcoming, completed } = formatInterviewData(
    interviewSnap as Interview[]
  );

  return (
    <DashboardLayout>
      <main className="flex flex-1 flex-col gap-6 p-8 lg:px-12">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Hey, {user.data.user?.user_metadata.full_name} 👋
          </h2>
          <p className="text-muted-foreground">
            Here is what happening with your interviews today.
          </p>
        </div>

        <div
          className="relative h-[320px] rounded-lg border overflow-hidden"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1634907959510-1e2b0c519be1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDl8fHxlbnwwfHx8fHw%3D)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50">
            <div className="flex h-full flex-col justify-end p-8">
              <h3 className="text-3xl font-bold text-white mb-2">
                Start an Interview
              </h3>
              <p className="text-white/80 mb-4">
                Begin your next interview session with just a click.
              </p>
              <Button className="w-fit" asChild>
                <Link href="/interviews">Schedule Your Interview</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Upcoming Interviews Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Upcoming Interviews
                </CardTitle>
                <Button variant="ghost" size="sm">
                  View all
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-[320px] overflow-y-auto">
              <div className="space-y-4">
                {upcoming.map((interview) => (
                  <div
                    key={interview.id}
                    className="group rounded-lg border p-4 hover:border-primary transition-colors"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold truncate">
                            {interview.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {interview.no_of_questions} questions •{" "}
                            {interview.max_time} mins
                          </p>
                        </div>
                        <div className="flex flex-col items-end text-sm">
                          <span className="font-medium">
                            {format(
                              parseISO(interview.scheduled_time),
                              "h:mm a"
                            )}
                          </span>
                          <span className="text-muted-foreground">
                            {format(
                              parseISO(interview.scheduled_time),
                              "MMM dd, yyyy"
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {interview.tags.split(",").map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                      <Button className="w-full">Join Interview</Button>
                    </div>
                  </div>
                ))}
                {upcoming.length === 0 && (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">
                      No Upcoming Interviews
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Schedule your next interview to get started
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Completed Interviews Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Completed
                </CardTitle>
                <Button variant="ghost" size="sm">
                  View all
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-[320px] overflow-y-auto">
              <div className="space-y-4">
                {completed.map((interview) => (
                  <div
                    key={interview.id}
                    className="group rounded-lg border p-4 hover:border-primary transition-colors"
                  >
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold truncate">
                            {interview.title}
                          </h4>
                          <span className="text-sm text-muted-foreground">
                            {format(
                              parseISO(interview.scheduled_time),
                              "MMM dd, yyyy"
                            )}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {interview.no_of_questions} questions •{" "}
                          {interview.time_taken || interview.max_time} mins
                        </p>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {interview.tags.split(",").map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                      <Button className="w-full">View Details</Button>
                    </div>
                  </div>
                ))}
                {completed.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">
                      No Completed Interviews
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Your completed interviews will appear here
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default DashboardView;

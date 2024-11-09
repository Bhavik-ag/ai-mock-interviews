import InterviewCard from "@/components/InterviewCard";
import DashboardLayout from "@/components/ui/dashboard-layout";
import { getInterviews } from "@/lib/supabase/serverside_fetchers";

export default async function InterviewsPage() {
  const interviews = await getInterviews();

  return (
    <DashboardLayout>
      <div className="p-6 sm:p-10 bg-neutral-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Interviews</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {interviews?.map((interview: any) => (
            <InterviewCard key={interview.id} interview={interview} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

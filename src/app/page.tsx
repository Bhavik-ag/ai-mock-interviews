import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getInterviewDetails } from "@/lib/supabase/serverside_fetchers";
import DashboardView from "@/views/DashboardView";

const Dashboard: React.FC = async () => {
  const user = await createSupabaseServerClient().auth.getUser();
  const userInterviewDetails = await getInterviewDetails(user.data.user?.id);

  console.log(userInterviewDetails?.length);
  return <DashboardView userInterviewDetails={userInterviewDetails} />;
};

export default Dashboard;

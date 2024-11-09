import DashboardLayout from "@/components/ui/dashboard-layout";
import ProfileView from "@/views/ProfileView";

const ProfilePage = () => {
  return (
    <DashboardLayout>
      <div className="p-6 sm:p-10 bg-neutral-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        <ProfileView />
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;

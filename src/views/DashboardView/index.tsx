import Link from "next/link";
import { Button } from "@/components/ui/button";

import DashboardLayout from "@/components/ui/dashboard-layout";
import { Database } from "@/app/database.types";
import UserInterviewDetailsCard from "./components/UserInterviewCard";

type DashboardViewProps = {
  userInterviewDetails:
    | Database["public"]["Views"]["interview_details"]["Row"][]
    | null;
};

const DashboardView = ({ userInterviewDetails }: DashboardViewProps) => {
  return (
    <DashboardLayout>
      <main className="flex flex-1 bg-muted flex-col gap-4 px-4 py-8 lg:gap-6 lg:px-12">
        <h2 className="text-2xl"> Hey, Prajjwal 👋</h2>

        <div
          className="flex flex-1 rounded-lg border border-dashed shadow-sm bg-green-500 max-h-[320px]"
          x-chunk="dashboard-02-chunk-1"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1634907959510-1e2b0c519be1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDl8fHxlbnwwfHx8fHw%3D)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            // backgroundBlendMode: "exclusion",
          }}
        >
          <div className="flex flex-col  gap-1  p-8  text-white justify-end ">
            <h3 className="text-2xl font-bold tracking-tight">
              Start an Interview
            </h3>
            <p className="text-sm ">
              You can start selling as soon as you add a product.
            </p>
            <Button className="mt-4">
              <Link href={"/interview"}>Start Interview</Link>
            </Button>
          </div>
        </div>
        <div className="flex gap-4 flex-wrap">
          {userInterviewDetails?.map((interviewDetails, index) => (
            <UserInterviewDetailsCard
              key={index}
              interviewDetails={interviewDetails}
            />
          ))}
        </div>
      </main>
    </DashboardLayout>
  );
};

export default DashboardView;

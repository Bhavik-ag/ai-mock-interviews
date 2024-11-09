import Link from "next/link";
import Navbar from "@/components/navbar";
import SidebarMenu from "@/components/SidebarMenu";
import OnboardingAlert from "@/components/OnboardingAlert";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import AvatarDropDown from "@/views/DashboardView/components/AvatarDropDown";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const {
    data: { user },
  } = await createSupabaseServerClient().auth.getUser();

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-white md:block">
        <div className="flex h-full max-h-screen flex-col gap-2 ">
          <div className="flex h-14 items-center px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="text-[28px]  font-serif">fleqo</span>
            </Link>
          </div>
          <div className="flex-1  justify-between flex flex-col ">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <SidebarMenu className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-all border border-transparent hover:text-neutral-900" />
            </nav>

            <div className="px-4 gap-2 flex-col flex py-4">
              {!user?.user_metadata?.isOnboarding && <OnboardingAlert />}
              {/* <div className=" border shadow-sm border-neutral-200 flex flex-col gap-2  rounded-md px-3 py-4">
                <h1 className="text-lg font-semibold">🚀 Upgrade to Pro</h1>
                <p className="text-xs">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Atque, porro?
                </p>

                <Button size={"lg"} variant={"outline"}>
                  {" "}
                  Upgrade Now
                </Button>
              </div> */}
              <div className=" border-neutral-200 shadow-sm border  flex gap-3  rounded-md px-3 py-4">
                <AvatarDropDown user={user} />

                <div className=" flex-col flex">
                  <span className="capitalize text-sm font-medium">
                    {user?.user_metadata.name}
                  </span>
                  <span className="text-[11px] font-normal">
                    {user?.user_metadata.email}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <Navbar user={user} />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;

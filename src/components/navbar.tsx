import { Bell, Menu, Settings2 } from "lucide-react";

import { type User } from "@/app/types";
import { Sheet } from "./ui/sheet";
import { SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import Link from "next/link";
import SidebarMenu from "./SidebarMenu";
import OnboardingAlert from "./OnboardingAlert";

const Navbar = ({ user }: { user: User }) => {
  return (
    <header className="flex justify-between h-[56px] items-center gap-4  border-b bg-neutral-100 px-4 lg:h-[56px] lg:px-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <Link
              href="#"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <span className="font-serif lowercase">FleqO</span>
            </Link>
            <SidebarMenu className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-3 text-muted-foreground hover:text-foreground text-sm" />
          </nav>
          <div className="mt-auto">
            {!user.user_metadata?.isOnboarding && <OnboardingAlert />}
          </div>
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-0.5 ml-auto">
        <div className="ml-auto h-10 w-10 flex items-center justify-center rounded-md hover:bg-neutral-100 border border-transparent hover:border-neutral-200">
          <Bell size={18} />
          <span className="sr-only">Toggle notifications</span>
        </div>
        <div className="ml-auto h-10 w-10 flex items-center justify-center rounded-md hover:bg-neutral-100 border border-transparent hover:border-neutral-200">
          <Settings2 size={18} />
          <span className="sr-only">Toggle notifications</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

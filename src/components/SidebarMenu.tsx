"use client";
import Link from "next/link";
import { Bolt, Layers2, LayoutGrid, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const menuList = [
  {
    icon: LayoutGrid,
    title: "Dashboard",
    href: "/",
  },
  {
    icon: Layers2,
    title: "Interviews",
    href: "/interviews",
  },
  {
    icon: UserRound,
    title: "Profile",
    href: "/my-profile",
  },
  {
    icon: Bolt,
    title: "Settings",
    href: "/usersettings",
  },
];

const SidebarMenu = ({ className }: { className: string }) => {
  const pathname = usePathname();

  return (
    <div className="mt-5 md:mt-2">
      {menuList.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className={cn(
            className,
            pathname === item.href &&
              "bg-[#EAFFF7] border-green-500/20 border text-neutral-900"
          )}
        >
          <item.icon
            size={20}
            stroke={pathname === item.href ? "#32E4b2" : "#666"}
          />
          {item.title}
        </Link>
      ))}
    </div>
  );
};

export default SidebarMenu;

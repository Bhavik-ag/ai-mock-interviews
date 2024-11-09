import { Timer } from "lucide-react";
import { Button } from "@/components/ui/button";

const InterviewNav = () => {
  return (
    <div className="px-4 h-14 fixed w-full z-50 bg-black flex items-center justify-between ">
      <h1 className="text-xl text-white  ">Fleqo</h1>
      <div className="flex items-center gap-2">
        <Button variant={"destructive"} className="flex gap-2 bg-red-500/20">
          <Timer size={16} />
          49:42
        </Button>
        <Button variant={"destructive"}>Exit Interview</Button>
      </div>
    </div>
  );
};

export default InterviewNav;

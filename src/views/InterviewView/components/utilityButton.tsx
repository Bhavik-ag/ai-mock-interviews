import { cn } from "@/lib/utils";

interface UtilityButtonProps {
  icon: React.ReactNode;
  tooltip: string;
  isActive: boolean;
  isDisabled?: boolean;
  onClick: () => void;
}

const UtilityButton: React.FC<UtilityButtonProps> = ({
  icon,
  tooltip,
  isActive,
  isDisabled = false,
  onClick,
}) => {
  return (
    <button
      className={cn(
        "h-14 w-14 flex cursor-pointer items-center justify-center transition-all rounded-full relative group",
        isActive
          ? "bg-neutral-700 text-neutral-100"
          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200",
      )}
      disabled={isDisabled}
      onClick={onClick}
    >
      {icon}
      <span
        className="bg-zinc-700/80 text-white text-[12px] absolute -right-[105%] -top-2 font-light rounded-lg p-1 px-2 
                   opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out
                   transform -translate-y-full -translate-x-1/2 mb-2 pointer-events-none"
      >
        {tooltip}
      </span>
    </button>
  );
};

export default UtilityButton;

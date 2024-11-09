import { cn } from "@/lib/utils";

const InterviewParticipantBlock = ({
  children,
  name = "John Doe",
  image,
}: {
  children?: React.ReactNode;
  name: string;
  image: string;
}) => {
  return (
    <div className="h-[320px] w-[600px] border-neutral-200/80  bg-white rounded-[8px] relative flex items-center justify-center  border overflow-hidden ">
      <div className="image h-[136px] w-[136px] rounded-full overflow-hidden">
        <img src={image} alt="" className="w-full bg-cover" />
      </div>
      <span
        className={cn(
          "text-xs absolute z-50 bottom-3 left-3 ",
          !children ? "text-neutral-600" : "text-neutral-50",
        )}
      >
        {name}
      </span>
      <div className="webcam absolute">{children}</div>
    </div>
  );
};

export default InterviewParticipantBlock;

import {
  CaptionsIcon,
  MicOffIcon,
  VideoOffIcon,
  MicIcon,
  VideoIcon,
  CaptionsOffIcon,
} from "lucide-react";
import UtilityButton from "./utilityButton";
import { useInterviewControls } from "@/states/interview";

interface ToolsBarProps {
  title: string;
  maxTime: number;
  isAISpeaking: boolean;
}

const ToolsBar = ({ isAISpeaking, title, maxTime }: ToolsBarProps) => {
  const {
    isMicOn,
    isCamOn,
    isCaptionOn,
    toggleMicrophone,
    toggleCamera,
    toggleCaptions,
  } = useInterviewControls();

  // Get date and month like 22 Aug
  const dateMonth = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });

  return (
    <div className="fixed bottom-0 w-full px-8 flex items-center justify-center h-[10vh] p-4 bg-white">
      <div className="info flex items-center gap-3 absolute left-10 text-neutral-700">
        <span className="time">{maxTime} mins</span>
        <div className="w-[1.6px] h-8 bg-neutral-200"></div>
        <span className="date">{dateMonth}</span>
        <div className="w-[1.6px] h-8 bg-neutral-200"></div>
        <span className="time font-normal">{title} </span>
      </div>

      <div className="utilities flex gap-2 items-center">
        <UtilityButton
          icon={
            isMicOn ? (
              <MicIcon strokeWidth={1.6} />
            ) : (
              <MicOffIcon strokeWidth={1.6} />
            )
          }
          isDisabled={isAISpeaking}
          tooltip="Microphone"
          isActive={isMicOn}
          onClick={toggleMicrophone}
        />
        <UtilityButton
          icon={
            isCamOn ? (
              <VideoIcon strokeWidth={1.6} />
            ) : (
              <VideoOffIcon strokeWidth={1.6} />
            )
          }
          tooltip="Webcam"
          isActive={isCamOn}
          onClick={toggleCamera}
        />
        <UtilityButton
          icon={
            isCaptionOn ? (
              <CaptionsIcon strokeWidth={1.6} />
            ) : (
              <CaptionsOffIcon strokeWidth={1.6} />
            )
          }
          tooltip="Captions"
          isActive={isCaptionOn}
          onClick={toggleCaptions}
        />
      </div>
    </div>
  );
};

export default ToolsBar;

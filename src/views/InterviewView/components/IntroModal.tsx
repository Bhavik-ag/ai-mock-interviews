import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Webcam from "react-webcam";
import ScheduledInterviewModal from "./ScheduledInterviewModal";

type IntroModalProps = {
  scheduledTime: string | undefined | null;
  onClose: () => void;
};

const IntroModal = ({ onClose, scheduledTime }: IntroModalProps) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [micPermission, setMicPermission] = useState(false);
  const [webcamPermission, setWebcamPermission] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [isTesting, setIsTesting] = useState(false);
  const [webcamQuality, setWebcamQuality] = useState("Unknown");
  const [startInterview, setStartInterview] = useState(false);

  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const microphone = useRef<MediaStreamAudioSourceNode | null>(null);
  const webcamRef = useRef<Webcam>(null);

  useEffect(() => {
    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  const testMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContext.current = new (window.AudioContext || window.AudioContext)();
      analyser.current = audioContext.current.createAnalyser();
      microphone.current = audioContext.current.createMediaStreamSource(stream);
      microphone.current.connect(analyser.current);

      setIsTesting(true);
      setMicPermission(true);

      const checkAudioLevel = () => {
        if (!analyser.current) return;
        const dataArray = new Uint8Array(analyser.current.frequencyBinCount);
        analyser.current.getByteFrequencyData(dataArray);
        const average =
          dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
        setMicLevel(average);

        if (isTesting) {
          requestAnimationFrame(checkAudioLevel);
        }
      };

      checkAudioLevel();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopMicrophoneTest = () => {
    setIsTesting(false);
    if (microphone.current) {
      microphone.current.disconnect();
    }
    if (audioContext.current) {
      audioContext.current.close();
    }
  };

  const checkWebcamQuality = () => {
    if (webcamRef.current && webcamRef.current.video) {
      const video = webcamRef.current.video;
      const { videoWidth, videoHeight } = video;
      if (videoWidth >= 1920 && videoHeight >= 1080) {
        setWebcamQuality("High (1080p or above)");
      } else if (videoWidth >= 1280 && videoHeight >= 720) {
        setWebcamQuality("Medium (720p)");
      } else {
        setWebcamQuality("Low (below 720p)");
      }
      setWebcamPermission(true);
    }
  };

  const sections = [
    {
      title: "Welcome to the Interview",
      content: (
        <div>
          <p>Here are some instructions for your interview:</p> <br />
          <ul className=" list-decimal list-inside">
            <li>Prepare a quiet environment</li>
            <li>Test your microphone and webcam</li>
            <li>Have a notepad ready for any notes</li>
          </ul>
        </div>
      ),
    },
    {
      title: "Permissions",
      content: (
        <div className="space-y-4">
          <div>
            <Button
              onClick={() => setMicPermission(true)}
              disabled={micPermission}
            >
              {micPermission ? "Microphone Allowed" : "Allow Microphone"}
            </Button>
          </div>
          <div>
            <Button
              onClick={() => setWebcamPermission(true)}
              disabled={webcamPermission}
            >
              {webcamPermission ? "Webcam Allowed" : "Allow Webcam"}
            </Button>
          </div>
        </div>
      ),
    },

    {
      title: "Test Audio and Video",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Microphone Test</h3>
            <div className="flex items-center space-x-4">
              <Button onClick={isTesting ? stopMicrophoneTest : testMicrophone}>
                {isTesting ? "Stop Test" : "Test Microphone"}
              </Button>
              <div className="w-48 h-4 bg-gray-200 rounded">
                <div
                  className="h-full bg-green-500 rounded"
                  style={{ width: `${(micLevel / 255) * 100}%` }}
                ></div>
              </div>
            </div>
            <p className="mt-2">
              Microphone accessibility:{" "}
              {micPermission ? "Allowed" : "Not allowed"}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Webcam Test</h3>
            <div className="space-y-2">
              <Webcam
                ref={webcamRef}
                audio={false}
                width={320}
                height={240}
                onUserMedia={checkWebcamQuality}
              />
              <p>Webcam quality: {webcamQuality}</p>
              <p>
                Webcam accessibility:{" "}
                {webcamPermission ? "Allowed" : "Not allowed"}
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Start Interview",
      content: (
        <div>
          <p>Are you ready to begin the interview?</p>
          <Button onClick={onClose} className="mt-4">
            Start Interview
          </Button>
        </div>
      ),
    },
  ];

  const nextSection = () =>
    setCurrentSection((prev) => Math.min(prev + 1, sections.length - 1));
  const prevSection = () => setCurrentSection((prev) => Math.max(prev - 1, 0));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
      {startInterview || scheduledTime == null ? (
        <div className="bg-white p-10 min-w-[560px]  flex flex-col justify-between min-h-[320px]  rounded-lg w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <h2
                className="text-2xl font-semibold mb-4"
                suppressHydrationWarning
              >
                {sections[currentSection].title}
              </h2>

              <div className="font-normal">
                {sections[currentSection].content}
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="mt-8 flex justify-between">
            <button
              className="text-sm flex gap-2 items-center"
              onClick={prevSection}
              disabled={currentSection === 0}
            >
              <ChevronLeft size={12} strokeWidth={1.2} /> Previous
            </button>
            <button
              className="text-sm flex gap-2 items-center"
              onClick={nextSection}
              disabled={currentSection === sections.length - 1}
            >
              Next <ChevronRight size={12} strokeWidth={1.2} />
            </button>
          </div>
        </div>
      ) : (
        <div>
          <ScheduledInterviewModal
            scheduledTime={new Date(scheduledTime as string)}
            setStartInterview={setStartInterview}
          />
        </div>
      )}
    </div>
  );
};

export default IntroModal;

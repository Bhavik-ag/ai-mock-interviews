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
  const animationFrame = useRef<number>();
  const mediaStream = useRef<MediaStream | null>(null);
  const webcamRef = useRef<Webcam>(null);

  useEffect(() => {
    return () => {
      stopMicrophoneTest();
    };
  }, []);
  const testMicrophone = async () => {
    try {
      // Stop any existing audio context and stream
      await stopMicrophoneTest();

      // Get new media stream with properly typed constraints
      mediaStream.current = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      // Create new audio context
      audioContext.current = new (window.AudioContext || window.AudioContext)();
      analyser.current = audioContext.current.createAnalyser();
      analyser.current.fftSize = 1024;
      analyser.current.smoothingTimeConstant = 0.8;

      microphone.current = audioContext.current.createMediaStreamSource(
        mediaStream.current
      );
      microphone.current.connect(analyser.current);

      setIsTesting(true);
      setMicPermission(true);

      const checkAudioLevel = () => {
        if (!analyser.current || !isTesting) return;

        const dataArray = new Uint8Array(analyser.current.frequencyBinCount);
        analyser.current.getByteFrequencyData(dataArray);

        // Calculate RMS value for more accurate level measurement
        const rms = Math.sqrt(
          dataArray.reduce((acc, val) => acc + val * val, 0) / dataArray.length
        );

        // Normalize and smooth the value
        const normalizedLevel = Math.min(Math.round((rms / 128) * 100), 100);
        setMicLevel(normalizedLevel);

        animationFrame.current = requestAnimationFrame(checkAudioLevel);
      };

      checkAudioLevel();
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setMicPermission(false);
    }
  };
  const stopMicrophoneTest = async () => {
    setIsTesting(false);

    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }

    if (microphone.current) {
      microphone.current.disconnect();
      microphone.current = null;
    }

    if (audioContext.current) {
      await audioContext.current.close();
      audioContext.current = null;
    }

    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => track.stop());
      mediaStream.current = null;
    }

    setMicLevel(0);
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
          <ul className="list-decimal list-inside">
            <li>Prepare a quiet environment</li>
            <li>Test your microphone and webcam</li>
            <li>Have a notepad ready for any notes</li>
            <li className="text-red-500">
              <strong>
                Once you are done answering you can click submit button to move
                to next question.
              </strong>
            </li>
          </ul>
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
              <div className="w-48 h-4 bg-gray-200 rounded overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded transition-all duration-100"
                  style={{ width: `${micLevel}%` }}
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
        <div className="bg-white p-10 min-w-[560px] flex flex-col justify-between min-h-[320px] rounded-lg w-full max-w-md">
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
            >
              {currentSection === sections.length - 1 ? (
                <>
                  <Button onClick={onClose} className="mt-4">
                    Start Interview
                  </Button>
                </>
              ) : (
                <>
                  Next <ChevronRight size={12} strokeWidth={1.2} />
                </>
              )}
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

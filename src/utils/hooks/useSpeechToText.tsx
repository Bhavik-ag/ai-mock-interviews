import { useEffect, useRef, useState } from "react";

type UseSpeechToTextReturn = {
  interimText: string;
  finalText: string;
  isListening: boolean;
  resetFinalText: () => void;
  startListening: () => void;
  stopListening: () => void;
};

export const useSpeechToText = (): UseSpeechToTextReturn => {
  const [finalText, setFinalText] = useState("");
  const [interimText, setInterimText] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-IN";
      recognitionRef.current = recognition;

      recognition.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptSegment = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptSegment + " ";
          } else {
            interimTranscript += transcriptSegment;
          }
        }
        setFinalText((prevText) => prevText + finalTranscript);
        setInterimText(interimTranscript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    setIsListening(true);
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    setIsListening(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const resetFinalText = () => {
    setFinalText("");
  };

  return {
    interimText,
    finalText,
    resetFinalText,
    isListening,
    startListening,
    stopListening,
  };
};

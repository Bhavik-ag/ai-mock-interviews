"use client";
import InterviewParticipantBlock from "./components/InterviewParticipantBlock";
import InterviewNav from "./components/nav";
import ToolsBar from "./components/ToolsBar";
import { Button } from "@/components/ui/button";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

import Editor from "@monaco-editor/react";
import Webcam from "react-webcam";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useSpeechToText } from "@/utils/hooks/useSpeechToText";
import IntroModal from "./components/IntroModal";
import {
  Interview,
  InterviewQuestion,
  Question,
  UserInterview,
} from "@/app/types";
import {
  useInterviewControls,
  useCurrentInterviewQuestion,
} from "@/states/interview";
import useInterview from "@/states/interview";
import { getQuestionAudio } from "@/utils/getQuestionAudio";
import { getAIResponse } from "@/utils/getAIResponse";
import { getAudio } from "@/utils/getAudio";
import { getDSAFollowup } from "@/utils/getDSAFollowup";
import { getQuestionAnswer } from "@/utils/getQuestionAnswer";
import useStore from "@/store";
import { SubmitType } from "@/constants";

interface InterviewViewProps {
  interview: Interview | null;
  user_interview: UserInterview | null;
  questions: Question[] | null;
  interview_questions: InterviewQuestion[] | null;
}

const InterviewView = ({
  interview,
  user_interview,
  questions,
  interview_questions,
}: InterviewViewProps) => {
  const [interviewStarted, setInterviewStarted] = useState<boolean>(false);

  const [codeQuestion, setCodeQuestion] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<string>("cpp");

  const { isCamOn, isMicOn, isCaptionOn, toggleMicrophone, toggleCaptions } =
    useInterviewControls();
  const { interview_state, updateInterviewState } = useInterview();
  const { currentQuestion, updateCurrentQuestion } =
    useCurrentInterviewQuestion();

  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const [followup, setFollowup] = useState<number>(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  console.log(interview_state, isPlaying, isFinished);

  const {
    interimText,
    startListening,
    stopListening,
    finalText,
    resetFinalText,
  } = useSpeechToText();

  const submitType = useStore((state: any) => state.submitType);
  const updateSubmitType = useStore((state: any) => state.updateSubmitType);
  const addMessage = useStore((state: any) => state.addMessage);
  const conversationHistory = useStore(
    (state: any) => state.conversationHistory,
  );

  console.log("Conversation History", conversationHistory);
  console.log(submitType);

  useEffect(() => {
    if (!interviewStarted || !currentAudio) return;

    const handleEnded = () => {
      setIsPlaying(false);
      setIsFinished(true);
      if (!isMicOn) {
        toggleMicrophone();
      }
      if (!isCaptionOn) {
        toggleCaptions();
      }
    };

    const quesAudio = new Audio(currentAudio);
    quesAudio.play();
    setIsPlaying(true);
    setIsFinished(false);
    if (isMicOn) {
      toggleMicrophone();
    }

    quesAudio.addEventListener("ended", handleEnded);

    return () => {
      quesAudio.removeEventListener("ended", handleEnded);
      quesAudio.pause();
      quesAudio.currentTime = 0;
    };
  }, [interviewStarted, currentAudio]);

  useEffect(() => {
    if (isMicOn) {
      startListening();
    } else {
      stopListening();
    }
  }, [isMicOn]);

  useEffect(() => {
    updateInterviewState({
      user_interview: user_interview,
      interview: interview,
      questions: questions,
      interview_questions: interview_questions,
    });
  }, []);

  useEffect(() => {
    if (questions && questions.length > 0) {
      updateCurrentQuestion(questions[currentQuestionIndex]);
    }
  }, [currentQuestionIndex]);

  useEffect(() => {
    console.log(currentQuestion);

    setTimeout(() => {
      getQuestionAudio(currentQuestion?.id || 0)
        .then((audio) => {
          setCurrentAudio(audio.signedUrl);
        })
        .catch((err) => {
          console.log(err);
        });

      setFollowup(currentQuestion?.no_of_followups || 0);

      if (currentQuestion?.type === "dsa") {
        setCodeQuestion(true);
      } else {
        setCodeQuestion(false);
      }
    }, 2000);
  }, [currentQuestion]);

  useEffect(() => {
    console.log("Followup puchega");
    setTimeout(() => {
      console.log(followup);
      if (currentQuestion?.type === "dsa") {
        askFollowup()
          .then(() => {
            console.log("Followup asked");
          })
          .catch(() => {
            console.log("Error in asking followup");
          });
      }
    }, 60000);
  }, [followup]);

  const askFollowup = async () => {
    const response = await getDSAFollowup(
      currentQuestion?.markdown_text || "",
      code,
    );

    console.log(response);

    const newAudio = await getAudio(response);

    setCurrentAudio(`data:audio/wav;base64,${newAudio.audioContent}`);
  };

  const askQuestion = async () => {
    updateSubmitType(SubmitType.ASK);
    if (!isMicOn) {
      toggleMicrophone();
    }
    console.log("Asking Question", finalText);
  };

  const submitAnswer = async () => {
    let response = "";
    let skipOnASK = false;

    const handleStart = async () => {
      response = await getAIResponse(
        currentQuestion?.transcript || "",
        finalText,
      );

      addMessage("Interviewer", currentQuestion?.transcript || "");

      addMessage("Candidate", finalText);

      updateSubmitType(SubmitType.FOLLOWUP);
    };

    const handleAsk = async () => {
      response = await getQuestionAnswer(
        currentQuestion?.markdown_text || "",
        code,
        finalText,
      );

      addMessage("Candidate", `${finalText}. The current code is: \n ${code}`);

      skipOnASK = true;
      updateSubmitType(SubmitType.FOLLOWUP);
    };

    const handleFollowup = async () => {
      response = await getDSAFollowup(
        currentQuestion?.markdown_text || "",
        code,
      );

      addMessage("Candidate", `${code} before submitting the answer.`);

      updateSubmitType(SubmitType.END);
    };

    const handleEnd = () => {
      console.log("Interview Ended");
    };

    switch (submitType) {
      case SubmitType.START:
        await handleStart();
        break;
      case SubmitType.ASK:
        await handleAsk();
        break;
      case SubmitType.FOLLOWUP:
        await handleFollowup();
        break;
      case SubmitType.END:
        handleEnd();
        return;
      default:
        console.log("Invalid Submit Type");
        return;
    }

    console.log(response);

    addMessage("Interviewer", response);

    const newAudio = await getAudio(response);
    setCurrentAudio(`data:audio/wav;base64,${newAudio.audioContent}`);
    resetFinalText();

    if (!skipOnASK) {
      console.log(followup);
      console.log(currentQuestion?.no_of_followups || 0);

      setTimeout(() => {
        if (followup !== 0) {
          setFollowup((prev) => prev - 1);
        } else {
          setCurrentQuestionIndex((prev) => prev + 1);
          updateSubmitType(SubmitType.END);
        }
      }, 5000);
    }
  };

  const handleCodeChange = (value: string | undefined) => {
    setCode(value || "");
  };

  return (
    <div className="bg-neutral-200/50  overflow-x-hidden w-full min-h-screen  ">
      {!interviewStarted && (
        <div className="bg-white/10 backdrop-blur-lg absolute w-full h-screen z-[9999]">
          <IntroModal
            scheduledTime={user_interview?.scheduled_time}
            onClose={() => {
              setInterviewStarted(true);
            }}
          />
        </div>
      )}

      <InterviewNav />
      <div className="flex gap-2  z-50 absolute bottom-4 right-4">
        <Button
          onClick={() => {
            setCodeQuestion((prev) => !prev);
          }}
        >
          Switch Mode
        </Button>
        <Button onClick={submitAnswer}>Submit Answer</Button>
        {/* <Button onClick={askFollowup}>Ask Followup</Button> */}
        <Button onClick={askQuestion}>Ask Question</Button>

        <br />
      </div>

      {/* ---------- question && editor --------- */}
      {codeQuestion && (
        <div className="min-h-screen py-14 flex">
          {" "}
          {/* Question Section */}
          <div className="w-1/2 p-6 overflow-y-auto">
            <MarkdownPreview
              className="!bg-transparent"
              source={currentQuestion?.markdown_text || ""}
              wrapperElement={{ "data-color-mode": "light" }}
            />
          </div>
          {/* Code Editor Section */}
          <div className="w-1/2 h-[84vh] bg-white">
            <div className="flex justify-end py-2">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-[180px] mx-3">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cpp">C++</SelectItem>
                  <SelectItem value="javascript">Javascript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Editor
              defaultLanguage="cpp"
              language={language}
              value={code}
              className="text-base pt-2"
              onChange={handleCodeChange}
            />
          </div>
        </div>
      )}
      {/* ----------------------------------------------- */}
      <div
        className={cn(
          "absolute right-4  z-50 flex gap-2 max-w-[90vw]  p-2 rounded-md  transition-all duration-700 -translate-y-1/2 origin-bottom-right",
          !codeQuestion
            ? "right-1/2 translate-x-1/2 top-1/2 bg-transparent"
            : "flex top-[70vh] scale-[0.4] bg-neutral-200 ",
        )}
      >
        {/* <span
          id="drag-video"
          className="rounded-sm  hover:bg-neutral-300  cursor-grab left-0 flex items-center justify-center bg-neutral-200 w-8 h-8"
        >
          <GripHorizontal />
        </span> */}
        <InterviewParticipantBlock
          name="Anne Doherty"
          image={
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXZhdGFyfGVufDB8fDB8fHww"
          }
        />

        <InterviewParticipantBlock
          name="John Doe"
          image={
            "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D"
          }
        >
          {isCamOn && <Webcam width={"100%"} />}
        </InterviewParticipantBlock>

        <div className="absolute  right-1/4  translate-x-1/2 bottom-12 rounded-md px-2 bg-black/40 text-white max-w-[460px]">
          {isCaptionOn && <p className="text-lg">{interimText}</p>}
        </div>
      </div>
      <ToolsBar
        isAISpeaking={isPlaying}
        title={interview?.title || ""}
        maxTime={interview?.max_time || 45}
      />
    </div>
  );
};

export default InterviewView;

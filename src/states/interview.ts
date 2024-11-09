import { create } from "zustand";
import {
  InterviewState,
  type InterviewControlsState,
  CurrentInterviewQuestionState,
} from "./types";

export const useInterviewControls = create<InterviewControlsState>((set) => ({
  isCamOn: true,
  isMicOn: false,
  isCaptionOn: false,

  // Additional settings (to be expanded later)
  settings: {
    // videoQuality: 'high',
    // audioInputDevice: 'default',
    // language: 'en',
  },

  // Actions
  toggleCamera: () => set((state) => ({ isCamOn: !state.isCamOn })),
  toggleMicrophone: () => set((state) => ({ isMicOn: !state.isMicOn })),
  toggleCaptions: () => set((state) => ({ isCaptionOn: !state.isCaptionOn })),

  updateSetting: (key, value) =>
    set((state) => ({
      settings: { ...state.settings, [key]: value },
    })),
}));

export const useCurrentTranscript = create((set) => ({
  transcript: "",
  updateTranscript: (transcript: string) => set({ transcript }),
  resetTranscript: () => set({ transcript: "" }),
}));

const useInterview = create<InterviewState>((set) => ({
  interview_state: {
    user_interview: null,
    interview: null,
    questions: null,
    interview_questions: null,
  },

  updateInterviewState: (newState) => set({ interview_state: newState }),
}));

export const useCurrentInterviewQuestion =
  create<CurrentInterviewQuestionState>((set) => ({
    currentQuestion: null,
    raw_answer: "",
    timeElapsed: 0,
    followUpQuestion: null,
    isCompleted: false,

    updateFollowUpQuestion: (question) => set({ followUpQuestion: question }),
    updateIsCompleted: (isCompleted) => set({ isCompleted }),
    updateElapsedTime: (time) => set({ timeElapsed: time }),
    updateRawAnswer: (answer) => set({ raw_answer: answer }),

    updateCurrentQuestion: (question) => set({ currentQuestion: question }),
  }));

export default useInterview;

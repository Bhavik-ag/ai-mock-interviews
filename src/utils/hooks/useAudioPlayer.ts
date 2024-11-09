import { useState, useEffect, useRef } from "react";

const useAudioPlayer = (url: string) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const audioRef = useRef(new Audio(url));

  useEffect(() => {
    const audio = audioRef.current;

    const handleEnded = () => {
      setIsPlaying(false);
      setIsFinished(true);
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
      setIsFinished(false);
    }
    setIsPlaying(!isPlaying);
  };

  return {
    isPlaying,
    isFinished,
    togglePlayPause,
  };
};

export default useAudioPlayer;

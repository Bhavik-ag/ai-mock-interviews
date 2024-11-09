import React, { useState, useEffect } from "react";
import { Mic, Speaker, Circle } from "lucide-react";

interface AIInterviewerProps {
  state: "idle" | "listening" | "thinking" | "speaking";
}

export const AIInterviewer = ({ state }: AIInterviewerProps) => {
  const getAnimation = () => {
    switch (state) {
      case "listening":
        return (
          <g>
            <circle cx="50" cy="50" r="40" fill="#4CAF50">
              <animate
                attributeName="r"
                values="35;45;35"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </circle>
            <Mic className="text-white" size={40} x="30" y="30" />
          </g>
        );
      case "speaking":
        return (
          <g>
            <circle cx="50" cy="50" r="40" fill="#2196F3">
              <animate
                attributeName="opacity"
                values="0.5;1;0.5"
                dur="1s"
                repeatCount="indefinite"
              />
            </circle>
            <Speaker className="text-white" size={40} x="30" y="30" />
          </g>
        );
      case "thinking":
        return (
          <g>
            <circle cx="50" cy="50" r="40" fill="#FFC107" />
            {[0, 1, 2].map((i) => (
              <circle key={i} cx={40 + i * 10} cy="50" r="3" fill="#FFFFFF">
                <animate
                  attributeName="opacity"
                  values="0;1;0"
                  dur="1.2s"
                  begin={`${i * 0.4}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cy"
                  values="50;45;50"
                  dur="1.2s"
                  begin={`${i * 0.4}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
            <circle
              cx="50"
              cy="50"
              r="48"
              stroke="#FF5722"
              fill="none"
              strokeWidth="4"
            >
              <animate
                attributeName="stroke-dasharray"
                values="0 300;300 300"
                dur="2s"
                repeatCount="indefinite"
              />
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 50 50"
                to="360 50 50"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        );
      default: // idle
        return (
          <g>
            <circle cx="50" cy="50" r="40" fill="#9E9E9E" />
            <Circle className="text-white" size={40} x="30" y="30">
              <animate
                attributeName="opacity"
                values="0.3;1;0.3"
                dur="2s"
                repeatCount="indefinite"
              />
            </Circle>
            <circle
              cx="50"
              cy="50"
              r="48"
              stroke="#9E9E9E"
              fill="none"
              strokeWidth="4"
              strokeDasharray="0 300"
            >
              <animate
                attributeName="stroke-dasharray"
                values="0 300;100 300;0 300"
                dur="4s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <svg width="200" height="200" viewBox="0 0 100 100">
        {getAnimation()}
      </svg>
      <p className="mt-4 text-xl font-semibold">{`AI is ${state}`}</p>
    </div>
  );
};

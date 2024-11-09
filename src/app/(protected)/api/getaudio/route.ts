// app/api/hello/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // If using query parameters from the request
  const { text } = await request.json();

  const API_KEY = process.env.API_KEY;
  const endpoint = `https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${API_KEY}`;
  const REQ_BODY = {
    audioConfig: {
      audioEncoding: "LINEAR16",
      effectsProfileId: ["small-bluetooth-speaker-class-device"],
      pitch: 0,
      speakingRate: 1,
    },
    input: {
      text,
    },
    voice: {
      languageCode: "en-US",
      name: "en-US-Journey-F",
    },
  };
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(REQ_BODY),
  });

  const result = await response.json();
  return NextResponse.json(result);
}

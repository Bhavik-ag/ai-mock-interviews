export async function getAudio(text: string) {
  const response = await fetch("/api/getaudio", {
    method: "POST",
    body: JSON.stringify({ text }),
  });
  const audio = await response.json();
  return audio;
}

// Use a function to safely get an Audio object only on the client.
function getAudio(src: string): HTMLAudioElement | null {
  if (typeof window !== "undefined" && typeof Audio !== "undefined") {
    return new Audio(src);
  }
  return null;
}

export const clickSound = getAudio("/sounds/click.mp3");
export const deploySound = getAudio("/sounds/deploy.mp3");
export const successSound = getAudio("/sounds/success.mp3");
export const typingSound = getAudio("/sounds/typing.mp3");
export const warningSound = getAudio("/sounds/warning.mp3");

import { useEffect, useState } from "react";

export function useSounds() {
  const [sounds, setSounds] = useState<{
    clickSound: HTMLAudioElement | null;
    deploySound: HTMLAudioElement | null;
    successSound: HTMLAudioElement | null;
    typingSound: HTMLAudioElement | null;
    warningSound: HTMLAudioElement | null;
  }>({
    clickSound: null,
    deploySound: null,
    successSound: null,
    typingSound: null,
    warningSound: null,
  });

  useEffect(function () {
    setSounds({
      clickSound: new Audio("/sounds/click.mp3"),
      deploySound: new Audio("/sounds/deploy.mp3"),
      successSound: new Audio("/sounds/success.mp3"),
      typingSound: new Audio("/sounds/typing.mp3"),
      warningSound: new Audio("/sounds/warning.mp3"),
    });
  }, []);

  return sounds;
}

import { Home } from "lucide-react";
import { ThemeProvider } from "~/components/context/theme-provider";
import { AuthProvider } from "~/components/context/auth-context";
import {
  FlashcardProvider,
  useFlashcard,
} from "~/components/context/flashcard-context";
import {
  Outlet,
  redirect,
  useLoaderData,
  useMatches,
  useNavigate,
  useRouteLoaderData,
  type LoaderFunctionArgs,
} from "react-router";
import { Toaster } from "~/components/ui/sonner";
import { Navbar } from "~/components/Navbar";
import { Footer } from "~/components/Footer";
import { isAuthenticatedServer } from "~/utils/auth.server";
import { useEffect, useRef, useState } from "react";
import { getRoute } from "~/utils/navigation.client";
import { match } from "assert";

const HOLD_THRESHOLD = 300; // in ms
const HOLD_OUT_DELAY = 300;
const DOUBLE_PRESS_THRESHOLD = 300; // in ms

export function ErrorBoundary() {
  return (
    <main className="bg-background text-foreground dark:bg-background dark:text-foreground">
      <main className="max-w-[1440px] mx-auto min-h-screen border-x-[2px] border-component-light-border dark:border-component-dark-border">
        <div className="h-screen flex items-center justify-center flex-col gap-4">
          <h1 className="text-3xl font-unbounded">Terjadi Kesalahan!</h1>
          <a href="/">
            {/* <Button> */}
            <Home />
            Home
            {/* </Button> */}
          </a>
        </div>
      </main>
    </main>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const authenticated = await isAuthenticatedServer(request);
  const pathname = url.pathname;

  if (pathname !== "/" && pathname !== "/404" && !authenticated) {
    return redirect("/");
  }

  return null;
}

function MainContent() {
  const matches = useMatches();
  const data = matches.at(-1)?.data;
  const { pageCode } = data as { pageCode: string };

  let materials = {};

  if ("materials" in (data as any)) {
    materials = (data as any).materials;
  }

  const mediaRecorderRef = useRef<MediaRecorder>(null);
  const mediaStream = useRef<MediaStream>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const lastDownTime = useRef<number | null>(null);
  const lastUpTime = useRef<number | null>(null);
  const holdTimer = useRef<NodeJS.Timeout | null>(null);
  const isHolding = useRef<boolean>(false);

  const navigate = useNavigate();
  const flashcard = useFlashcard();
  const [recording, setRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isStarting, setIsStarting] = useState<boolean>(false);

  const playBeep = () => {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(1000, ctx.currentTime);
    oscillator.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.2);
  };

  const handlePlayAudio = async () => {
    if (!audioRef.current) {
      console.error("Audio ref hasn't been set up");
      return;
    }

    setIsPlaying(true);
    try {
      await audioRef.current.play();
    } catch (error) {
      console.error("Audio autoplay was prevented:", error);
    }

    audioRef.current.addEventListener("ended", handleStopAudio);
  };

  const handleStopAudio = () => {
    if (!audioRef.current) {
      console.error("Audio ref hasn't been set up");
      return;
    }

    audioRef.current.pause();
    audioRef.current = null;
    setIsPlaying(false);
  };

  const sendAudioToCommandAPI = async (blob: Blob, pageCode: string) => {
    const formData = new FormData();
    formData.append("audio", blob, "command.webm");
    formData.append("pageCode", pageCode);
    formData.append("materials", JSON.stringify(materials));

    try {
      const response = await fetch("/api/command", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (!data.success) {
        console.error("Command API error:", data.error);
        return;
      }

      const commandStr = data.command as string;

      const commandArr = commandStr.split(" ");

      const cmd = commandArr[0];

      if (cmd === "unknown_command") {
        return;
      }

      const arg1 = commandArr[1];
      const arg2 = commandArr.length > 2 ? commandArr[2] : "";
      const arg3 = commandArr.length > 3 ? commandArr[3] : "";

      console.log(cmd);

      if (cmd === "navigate") {
        navigate(getRoute(arg1, arg2));
      } else if (cmd === "flashcard_next") {
        console.log("flashcard_next - totalCards:", flashcard.totalCards);
        if (flashcard.totalCards > 0) {
          flashcard.nextCard();
        } else {
          console.log("No cards available for flashcard_next");
        }
      } else if (cmd === "flashcard_previous") {
        if (flashcard.totalCards > 0) {
          flashcard.previousCard();
        }
      } else if (cmd === "flashcard_read_question") {
        if (flashcard.totalCards > 0) {
          flashcard.readQuestion();
        }
      } else if (cmd === "flashcard_read_answer") {
        if (flashcard.totalCards > 0) {
          flashcard.readAnswer();
        }
      } else if (cmd === "flashcard_show_answer") {
        if (flashcard.totalCards > 0) {
          flashcard.showAnswerAction();
        }
      } else if (cmd === "flashcard_show_question") {
        if (flashcard.totalCards > 0) {
          flashcard.showQuestionAction();
        }
      }

      // 🔊 Play the returned TTS audio
      if (data.ttsAudio) {
        const audio = new Audio(`data:audio/mp3;base64,${data.ttsAudio}`);
        audioRef.current = audio;
        handlePlayAudio();
      }
    } catch (error) {
      console.error("Error sending audio:", error);
    }
  };

  const handleSpaceHold = async () => {
    if (audioRef.current !== null || isPlaying) return;

    const micNotFoundAudio = new Audio("/micnotfound.mp3");

    try {
      const permission = await navigator.permissions.query({
        name: "microphone",
      });

      if (permission.state === "granted") {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        const mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });
          chunksRef.current = [];

          sendAudioToCommandAPI(blob, pageCode);
        };

        mediaRecorder.onstart = () => {
          setRecording(true);
          setIsStarting(false);
          playBeep();
        };

        mediaRecorderRef.current = mediaRecorder;
        mediaStream.current = stream;
        mediaRecorderRef.current.start();
      } else if (permission.state === "prompt") {
        audioRef.current = micNotFoundAudio;
        handlePlayAudio();

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        stream.getTracks().forEach((track) => track.stop());
      } else if (permission.state === "denied") {
        console.error("Izin mikrofon ditolak");
        return;
      }
    } catch (err) {
      alert("Izin mikrofon ditolak");

      if (audioRef.current !== null && isPlaying) return;

      audioRef.current = micNotFoundAudio;
      await handlePlayAudio();
      setIsStarting(false);
    }
  };

  const handleSpaceDoublePress = async () => {
    handleStopAudio();
  };

  useEffect(() => {
    const handleKeyDown = async (e: any) => {
      if (e.code !== "Space") return;

      e.preventDefault();

      const now = Date.now();

      if (isHolding.current) return;

      lastDownTime.current = now;

      if (!recording && !isPlaying) {
        holdTimer.current = setTimeout(() => {
          isHolding.current = true;
          handleSpaceHold();
        }, HOLD_THRESHOLD);
      }
    };

    const handleKeyUp = (e: any) => {
      if (e.code !== "Space") return;

      e.preventDefault();

      const now = Date.now();

      if (holdTimer.current) {
        clearTimeout(holdTimer.current);
        holdTimer.current = null;
      }

      const pressDuration = now - (lastDownTime.current ?? 0);
      if (isHolding.current) {
        if (recording) {
          setTimeout(() => {
            mediaStream.current?.getTracks().forEach((track) => track.stop());
            mediaRecorderRef.current?.stop();
            setRecording(false);
          }, HOLD_THRESHOLD + HOLD_OUT_DELAY);
        }
        isHolding.current = false;
      } else if (pressDuration < HOLD_THRESHOLD) {
        if (
          lastUpTime.current &&
          now - lastUpTime.current < DOUBLE_PRESS_THRESHOLD
        ) {
          handleSpaceDoublePress();
          lastUpTime.current = null;
        } else {
          lastUpTime.current = now;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [recording, isStarting]);

  return (
    <main className="text-black dark:text-white">
      <Navbar />
      <main className="max-w-[1920px] mx-auto min-h-screen overflow-x-hidden flex flex-col items-center">
        <Outlet />
        <Toaster />
      </main>
      <Footer />
    </main>
  );
}

export default function Index() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <FlashcardProvider>
          <MainContent />
        </FlashcardProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

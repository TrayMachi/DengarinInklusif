import { Home } from "lucide-react";
import { ThemeProvider } from "~/components/context/theme-provider";
import { AuthProvider } from "~/components/context/auth-context";
import {
  Outlet,
  redirect,
  useLoaderData,
  useNavigate,
  type LoaderFunctionArgs,
} from "react-router";
import { Toaster } from "~/components/ui/sonner";
import { Navbar } from "~/components/Navbar";
import { Footer } from "~/components/Footer";
import { isAuthenticatedServer } from "~/utils/auth.server";
import { useEffect, useRef, useState } from "react";
import { validateCommand } from "~/utils/navigation";

const pageRoutes: { [key: string]: (arg0?: any) => string } = {
  lanpage: () => "/",
  menu: () => "/menu",
  material: () => "/menu/materi",
  material_detail: (code: string) => `/menu/materi/${code}`,
  settings: () => "/menu/pengaturan",
};

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

  return { pageCode: "lanpage" };
}

export default function Index() {
  const { pageCode } = useLoaderData<{ pageCode: string }>();
  const mediaRecorderRef = useRef<MediaRecorder>(null);
  const mediaStream = useRef<MediaStream>(null);
  const chunksRef = useRef<Blob[]>([]);
  const navigate = useNavigate();
  const [recording, setRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isStarting, setIsStarting] = useState<boolean>(false);
  const [micPermissionStatus, setMicPermissionStatus] = useState<
    "prompt" | "granted" | "denied" | "unsupported"
  >("prompt");
  const [hasAskedBefore, setHasAskedBefore] = useState<boolean>(false);

  const playBeep = () => {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(1000, ctx.currentTime);
    oscillator.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.2);
  };

  const handlePlayAudio = async (audio: HTMLAudioElement) => {
    setIsPlaying(true);
    try {
      await audio.play();
    } catch (error) {
      console.error("Audio autoplay was prevented:", error);
    } finally {
      setIsPlaying(false);
    }
  };

  const sendAudioToCommandAPI = async (blob: Blob, pageCode: string) => {
    const formData = new FormData();
    formData.append("audio", blob, "command.webm");
    formData.append("pageCode", pageCode);

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

      if (!validateCommand(commandStr)) {
        console.error("Command error: Invalid command");
        return;
      }

      const commandArr = commandStr.split(" ");

      const cmd = commandArr[0];
      const arg = commandArr[1];

      if (cmd === "navigate") {
        if (commandArr.length > 2) {
          const arg2 = commandArr[2];
          navigate(pageRoutes[arg](arg2));
        }
        navigate(pageRoutes[arg]());
      }

      // 🔊 Play the returned TTS audio
      if (data.ttsAudio) {
        const audio = new Audio(`data:audio/mp3;base64,${data.ttsAudio}`);
        handlePlayAudio(audio);
      }
    } catch (error) {
      console.error("Error sending audio:", error);
    }
  };

  useEffect(() => {
    const micNotFoundAudio = new Audio("/micnotfound.mp3");

    const handleKeyDown = async (e: any) => {
      if (e.code === "Space") e.preventDefault();

      if (e.code === "Space" && !recording && !isPlaying) {
        if (micPermissionStatus !== "granted") {
          handlePlayAudio(micNotFoundAudio);
          (
            await navigator.mediaDevices.getUserMedia({
              audio: true,
            })
          )
            .getAudioTracks()
            .forEach((track) => track.stop());
          return;
        }

        try {
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
        } catch (err) {
          alert("Microphone access denied");
          await handlePlayAudio(micNotFoundAudio);
          setIsStarting(false);
        }
      }
    };

    const handleKeyUp = (e: any) => {
      if (e.code === "Space" && recording) {
        // ⏳ Delay 500ms sebelum stop rekaman
        setTimeout(() => {
          mediaStream.current?.getTracks().forEach((track) => track.stop());
          mediaRecorderRef.current?.stop();
          setRecording(false);
        }, 500);
      }
    };

    const checkMicPermission = async () => {
      if (!navigator.permissions) {
        setMicPermissionStatus("unsupported");
        return;
      }

      try {
        const result = await navigator.permissions.query({
          name: "microphone" as PermissionName,
        });
        setMicPermissionStatus(result.state as any);
        result.onchange = () => {
          setMicPermissionStatus(result.state as any);
        };
      } catch (e) {
        console.warn("Permissions API not fully supported", e);
        setMicPermissionStatus("unsupported");
      }
    };

    checkMicPermission();

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [recording, isStarting]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <main className="text-black dark:text-white">
          <Navbar />
          <main className="max-w-[1920px] mx-auto min-h-screen overflow-x-hidden flex flex-col items-center">
            <Outlet />
            <Toaster />
          </main>
          <Footer />
        </main>
      </AuthProvider>
    </ThemeProvider>
  );
}

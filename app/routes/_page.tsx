import { Home } from "lucide-react";
import { ThemeProvider } from "~/components/context/theme-provider";
import { AuthProvider } from "~/components/context/auth-context";
import { Outlet, type LoaderFunctionArgs } from "react-router";
import { Toaster } from "~/components/ui/sonner";
import { Navbar } from "~/components/Navbar";
import { Footer } from "~/components/Footer";
import { useEffect, useRef, useState } from "react";

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
  return null;
}

export default function Index() {
  const mediaRecorderRef = useRef<MediaRecorder>(null);
  const mediaStream = useRef<MediaStream>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [recording, setRecording] = useState(false);
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

  useEffect(() => {
    const handleKeyDown = async (e: any) => {
      if (e.code === "Space" && !recording && !isStarting) {
        setIsStarting(true);
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
            const url = URL.createObjectURL(blob);
            chunksRef.current = [];
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

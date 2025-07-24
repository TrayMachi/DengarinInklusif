import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function NotFoundPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const audio = new Audio("/404NotfoundAudio.mp3");

    const handlePlayAudio = async () => {
      try {
        await audio.play();
      } catch (error) {
        console.log("Audio autoplay was prevented:", error);
      }
    };

    const handleAudioEnd = () => {
      navigate("/");
    };

    audio.addEventListener("ended", handleAudioEnd);
    handlePlayAudio();

    return () => {
      audio.removeEventListener("ended", handleAudioEnd);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [navigate]);

  return (
    <div className="flex flex-col gap-4 items-center justify-center px-4">
      <img src="/404.webp" alt="404" className="w-30 h-39" />
      <h1 className="text-3xl text-center font-bold text-primary">
        Halaman Tidak Ditemukan
      </h1>
      <Link to="/" className="mx-auto">
        <Button>Kembali ke Beranda</Button>
      </Link>
    </div>
  );
}

import React from "react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { FileText, GraduationCap, Mic, Scan } from "lucide-react";
import { Link } from "react-router";

export const HeroSection = () => {
  return (
    <section className="w-full h-fit py-12 md:py-24 lg:py-32 xl:py-40 relative">
      <div className="px-4 md:px-6 w-full">
        <div className="flex flex-col items-center space-y-8 text-center w-full">
          <Badge
            variant="secondary"
            className="px-4 md:px-6 py-3 text-[14px] md:text-xl font-bold"
          >
            Platform Pembelajaran Berbasis Audio
          </Badge>
          <div className="space-y-8 py-2 items-center text-center justify-center">
            <h1 className="text-2xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-6xl/none bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Pembelajaran yang Dipersonalisasi
              <br />
              untuk Siswa Tunanetra
            </h1>
            <div className="flex max-md:flex-col items-center justify-center gap-3 max-md:w-full md:gap-8 text-sm text-muted-foreground">
              <div className="flex max-md:w-full max-md:justify-center items-center gap-2 border-[1px] rounded-[12px] py-3 px-4">
                <span
                  className="text-2xl"
                  role="img"
                  aria-label="Accessibility icon"
                >
                  <FileText />
                </span>
                <span>Pembaca Layar</span>
              </div>
              <div className="flex max-md:w-full max-md:justify-center items-center gap-2 border-[1px] rounded-[12px] py-3 px-4">
                <span className="text-2xl" role="img" aria-label="Voice icon">
                  <Mic />
                </span>
                <span>Navigasi Suara</span>
              </div>
              <div className="flex max-md:w-full max-md:justify-center items-center gap-2 border-[1px] rounded-[12px] py-3 px-4">
                <span
                  className="text-2xl"
                  role="img"
                  aria-label="Education icon"
                >
                  <GraduationCap />
                </span>
                <span>Sesuai Kurikulum</span>
              </div>
            </div>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl max-md:text-justify">
              Memberdayakan siswa tunanetra dan low vision di Indonesia melalui
              pelajaran berbasis audio, latihan suara, serta konversi dokumen ke
              suara untuk jenjang SD hingga SMA.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 py-2 max-md:w-full">
            <Link to="/menu" className="w-full">
              <Button size="lg" className="h-12 max-md:w-full px-8">
                Mulai Belajar
              </Button>
            </Link>
            <a href="https://youtu.be/5aXs92crCY8">
              <Button
                variant="outline"
                size="lg"
                className="h-12 max-md:w-full px-8"
              >
                Tonton Demo
                <span className="sr-only">Lihat demonstrasi platform</span>
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

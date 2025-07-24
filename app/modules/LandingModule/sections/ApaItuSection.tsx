export default function ApaItuSection() {
  return (
    <div className="relative min-h-[700px] my-[200px] w-full flex flex-col gap-8 lg:gap-16 px-4 lg:px-20 max-lg:items-center justify-center items-start overflow-hidden">


      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>

      {/* Title Section */}
      <div className="z-[10] flex flex-col items-center justify-center w-full text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4">
          Apa itu{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Dengar Inklusif
          </span>
          ?
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
      </div>

      {/* Content Section */}
      <div className="flex flex-row justify-between w-full max-lg:flex-col gap-12 lg:gap-20 z-[10]">
        {/* Text Content */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="bg-card/50 backdrop-blur-md border border-border rounded-2xl p-8 shadow-2xl">
            <div className="space-y-6">
              {/* Problem Statement */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-destructive flex items-center">
                  <span className="w-2 h-2 bg-destructive rounded-full mr-3"></span>
                  Tantangan Pendidikan
                </h3>
                <p className="text-muted-foreground text-base leading-relaxed">
                  Siswa tunanetra di Indonesia menghadapi hambatan pendidikan
                  kritis karena kurangnya platform pembelajaran digital yang
                  aksesibel, dengan lebih dari 10.000 siswa tunanetra di SLB dan
                  95% platform yang tidak memiliki fitur aksesibilitas yang
                  memadai.
                </p>
              </div>

              {/* Solution */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-primary flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Solusi Inovatif
                </h3>
                <p className="text-muted-foreground text-base leading-relaxed">
                  <strong className="text-foreground">Dengar Inklusif</strong>{" "}
                  menawarkan solusi dengan navigasi berbasis suara, konversi
                  dokumen ke audio menggunakan TTS canggih, dan pelajaran audio
                  interaktif yang selaras dengan kurikulum nasional.
                </p>
              </div>

              {/* Technology */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-accent flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>
                  Teknologi Modern
                </h3>
                <p className="text-muted-foreground text-base leading-relaxed">
                  Dibangun menggunakan React Router v7, Supabase, Google Cloud
                  TTS, Whisper AI, dan OCR, platform ini memastikan dukungan
                  penuh untuk screen reader, navigasi keyboard, dan standar ARIA
                  untuk pengalaman belajar inklusif SD hingga SMA.
                </p>
              </div>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-center backdrop-blur-sm">
              <div className="text-2xl font-bold text-primary">10,000+</div>
              <div className="text-sm text-muted-foreground">
                Siswa Tunanetra
              </div>
            </div>
            <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 text-center backdrop-blur-sm">
              <div className="text-2xl font-bold text-accent">95%</div>
              <div className="text-sm text-muted-foreground">
                Platform Tidak Aksesibel
              </div>
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <div className="relative group">
            <div className="absolute h-3/4 -inset-4 bg-gradient-to-r from-primary to-accent rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="relative bg-card/50 backdrop-blur-md border border-border rounded-2xl p-6 shadow-2xl">
              <img
                src="/apaitu.webp"
                alt="Dengar Inklusif Platform Illustration"
                className="w-full max-w-[500px] h-3/4 object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

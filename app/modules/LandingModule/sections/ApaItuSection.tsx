export default function ApaItuSection() {
  return (
    <div className="relative min-h-[700px] my-[200px] w-full flex flex-col gap-8 lg:gap-16 px-4 lg:px-20 max-lg:items-center justify-center items-start overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>

      {/* Title Section */}
      <div className="z-[10] flex flex-col items-center justify-center w-full text-center">
        <h2 className="text-2xl sm:text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight text-foreground mb-4">
          Apa itu{" "}
          <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
            Dengar Inklusif
          </span>
          ?
        </h2>
        <div className="w-1/2 h-1 bg-gradient-to-r from-primary to-[oklch(0.8952 0.0504 146.0366)] rounded-full opacity-100"></div>
      </div>

      {/* Content Section */}
      <div className="flex flex-row justify-center w-full max-lg:flex-col gap-5 lg:gap-10 z-[10]">
        {/* Text Content */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="bg-card/50 backdrop-blur-md border border-border rounded-2xl p-8 shadow-2xl">
            <div className="space-y-6">
              {/* Problem Statement */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground flex items-center">
                  <span className="w-2 h-2 bg-foreground rounded-full mr-3"></span>
                  Pembelajaran Pintar untuk Tunanetra
                </h3>
                <p className="text-muted-foreground text-base leading-relaxed text-justify">
                  Siswa tunanetra di Indonesia menghadapi hambatan pendidikan
                  kritis karena kurangnya platform pembelajaran digital yang
                  aksesibel, dengan lebih dari 10.000 siswa tunanetra di SLB dan
                  95% platform yang tidak memiliki fitur aksesibilitas yang
                  memadai.
                </p>
              </div>

              {/* Solution */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground flex items-center">
                  <span className="w-2 h-2 bg-foreground rounded-full mr-3"></span>
                  Dari PDF ke Pembelajaran Suara Interaktif
                </h3>
                <p className="text-muted-foreground text-base leading-relaxed text-justify">
                  Cukup unggah materi, lalu sistem akan membuat flashcard,
                  rangkuman, dan kuis suara—dengan panduan dari asisten AI yang
                  ramah.
                </p>
              </div>

              {/* Technology */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground flex items-center">
                  <span className="w-2 h-2 bg-foreground rounded-full mr-3"></span>
                  Dirancang Inklusif, Berdampak Nyata
                </h3>
                <p className="text-muted-foreground text-base leading-relaxed text-justify">
                  Lebih dari sekadar aksesibilitas—DengarInklusif memberikan
                  pengalaman belajar yang personal, menarik, dan sesuai
                  kebutuhan tiap siswa.
                </p>
              </div>
            </div>
          </div>
        </div>


        {/* Image Section */}
        <div className="max-lg:hidden w-full lg:w-1/2 xl:w-1/4 flex justify-center lg:justify-center">
          <div className="relative group">
            <div className="absolute h-3/4 -inset-4 bg-gradient-to-r from-primary to-accent dark:opacity-10 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="relative bg-card/50 backdrop-blur-md border border-border rounded-2xl p-6 shadow-2xl">
              <img
                src="/apaitu.jpg"
                alt="Dengar Inklusif Platform Illustration"
                className="w-full max-w-[500px] h-3/4 object-contain rounded-xl"
              />
            </div>
          </div>
        </div>

        <div className="lg:hidden w-full flex justify-center lg:justify-center">
          <div className="relative group">
            <div className="absolute h-3/4 -inset-4 bg-gradient-to-r from-primary to-accent dark:opacity-10 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
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

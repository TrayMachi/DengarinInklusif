export default function ApaItuSection() {
  return (
    <div className="relative h-fit lg:h-[694px] w-full flex flex-col gap-5 lg:gap-4 xl:gap-10 px-0 lg:px-20 max-lg:items-center justify-center items-start text-white font-sans">
      <div className="z-[10] flex flex-col md:flex-row items-center md:items-center justify-center w-full md:gap-3 max-sm:px-5 max-lg:px-16 font-sans">
        <div className="text-2xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground md:mb-1 lg:mb-2 xl:mb-3">
          Apa itu Dengar Inklusif?
        </div>
      </div>

      <div className="flex flex-row items-center justify-between w-full max-md:flex-col gap-20">
        <div className="text-muted-foreground md:text-xl z-[10] max-sm:px-5 max-lg:px-16 max-lg:pb-20 w-full text-justify">
          Visually impaired students in Indonesia face critical educational
          barriers due to the lack of accessible digital learning platforms,
          with over 10,000 blind students in SLBs and 95% of platforms lacking
          proper accessibility features. Existing tools are often visually
          biased, poorly integrated with screen readers, and lack audio or
          tactile support, leading to reduced academic engagement and
          inequality. Addressing this, *Dengar Inklusif* offers an
          accessibility-first solution with voice-based navigation,
          document-to-audio conversion using advanced TTS, and interactive audio
          lessons aligned with the national curriculum. Built using modern
          technologies like React Router v7, Supabase, Google Cloud TTS, Whisper
          AI, and OCR, the platform ensures full support for screen readers,
          keyboard navigation, and ARIA standards to create an inclusive
          learning experience for SD to SMA students.
        </div>
        <div className="z-[1] max-lg:hidden w-[525px]">
          <img src="/apaitu.webp" alt="text logo" className="object-contain" />
        </div>
      </div>
    </div>
  );
}

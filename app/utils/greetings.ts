import type { MaterialFetch } from "./prompts";

const LANDING_PAGE_GREETINGS = `Selamat datang di platform pembelajaran berbasis audio. Saat ini anda berada di halaman Landing Page. Pembelajaran yang dipersonalisasi untuk siswa tunanetra. Apakah Anda ingin mulai belajar sekarang?`;
const MENU_PAGE_GREETINGS = `Selamat datang di dashboard Anda. Apakah Anda ingin pergi ke halmaan materi atau membuka pengaturan?`;
const MATERIAL_GREETINGS_PRE = `Anda berada di halaman Materi, berikut daftar materi yang Anda miliki:`;
const MATERIAL_DETAIL_PRE = `Anda berada di materi `;
const MATERIAL_DETAIL_SUFF = ` Apakah Anda ingin memainkan flashcards, membuat ulang flashcards, mulai sesi tanya jawab, atau mendengarkan rangkuman materi ini?`;

export function getGreeting(
  pageCode: string,
  materials?: MaterialFetch[],
): string {
  if (pageCode === "lanpage") {
    return LANDING_PAGE_GREETINGS;
  } else if (pageCode === "menu") {
    return MENU_PAGE_GREETINGS;
  } else if (pageCode === "material") {
    let str = "\n";
    if (!materials)
      return "Anda berada di halaman Materi, saat ini tidak ada materi yang tersedia";
    for (let i = 0; i < materials?.length; i++) {
      str +=
        "1. " +
        materials[i].title +
        " dengan kode " +
        materials[i].code +
        ".\n";
    }
    return MATERIAL_GREETINGS_PRE + str;
  }
  return "";
}

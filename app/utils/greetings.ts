const LANDING_PAGE_GREETINGS = `Selamat datang di platform pembelajaran berbasis audio. Saat ini anda berada di halaman Landing Page. Pembelajaran yang dipersonalisasi untuk siswa tunanetra. Apakah Anda ingin mulai belajar sekarang?`;
const MENU_PAGE_GREETINGS = `Selamat datang di dashboard Anda. Apakah Anda ingin pergi ke halmaan materi atau membuka pengaturan?`;
const MATERIAL_GREETINGS_PRE = `Anda berada di halaman Materi, berikut daftar materi yang Anda miliki:`;
const MATERIAL_DETAIL_PRE = `Anda berada di materi `;
const MATERIAL_DETAIL_SUFF = ` Apakah Anda ingin memainkan flashcards, membuat ulang flashcards, mulai sesi tanya jawab, atau mendengarkan rangkuman materi ini?`;

function getGreeting(pageCode: string) {
  if (pageCode === "lanpage") {
    return LANDING_PAGE_GREETINGS;
  }
}

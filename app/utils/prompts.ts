import type { Prisma } from "~/lib/generated/client";

const LANDING_PAGE_COMMANDS = `
Current Page: Landing Page

Available Commands:
Command | Description
-------------
"navigate [page_code]" | Pindah ke halaman dengan kode page_code
"read" | Bacakan isi halaman
"back" | Kembali ke halaman sebelumnya

Available [page_code] values:
Code | Keyword / Description
-----------------------
lanpage | Landing page
menu | Menu, dashboard, main page, beranda, or halaman utama
material |  Material, materi, halaman utama materi, or pelajaran
settings | Settings, pengaturan, preferences, preferensi, or atur akun
`;

const MENU_PAGE_COMMANDS = `
Current Page: Menu

Available Commands:
Command | Description
-------------
"navigate [page_code]" | Pindah ke halaman dengan kode page_code
"read" | Bacakan isi halaman
"back" | Kembali ke halaman sebelumnya

Available [page_code] values:
Code | Keyword / Description
-----------------------
lanpage | Landing page
menu | Menu, dashboard, main page, beranda, or halaman utama
material |  Material, materi, halaman utama materi, or pelajaran
settings | Settings, pengaturan, preferences, preferensi, or atur akun
`;

const MATERIAL_PAGE_COMMANDS = `
Current Page: Material

Available Commands:
Command | Description
-------------
"navigate [page_code]" | Pindah ke halaman dengan kode page_code
"read" | Bacakan isi halaman
"navigate material_detail [material_code]" | Membuka detail dari material dengan kode code
"back" | Kembali ke halaman sebelumnya

Available [page_code] values:
Code | Keyword / Description
-----------------------
lanpage | Landing page
menu | Menu, dashboard, main page, beranda, or halaman utama
material |  Material, materi, halaman utama materi, or pelajaran
material_detail [material_code] | Material with code [material_code] or materi kode [material_code]
settings | Settings, pengaturan, preferences, preferensi, or atur akun

Available [material_code] values:
Code | Title
--------------
`;

const MATERIAL_DETAIL_PAGE_COMMANDS = `
Current Page: Material Detail

Available Commands:
Command | Description
-------------
"navigate [page_code]" | Pindah ke halaman dengan kode page_code
"read" | Bacakan isi halaman
"ringkasan" | Membuka isi ringkasan dari material
"back" | Kembali ke halaman sebelumnya

Available [page_code] values:
Code | Keyword / Description
-----------------------
lanpage | Landing page
menu | Menu, dashboard, main page, beranda, or halaman utama
material |  Material, materi, halaman utama materi, or pelajaran
settings | Settings, pengaturan, preferences, preferensi, or atur akun
`;

const SETTING_PAGE_COMMANDS = `
Available Commands:
Command | Description
-------------
"navigate [page_code]" | Pindah ke halaman dengan kode page_code
"read" | Bacakan isi halaman
"back" | Kembali ke halaman sebelumnya

Available [page_code] values:
Code | Keyword / Description
-----------------------
lanpage | Landing page
menu | Menu, dashboard, main page, beranda, or halaman utama
material |  Material, materi, halaman utama materi, or pelajaran
settings | Settings, pengaturan, preferences, preferensi, or atur akun
`;

const FLASHCARD_COMMANDS = `
Available Commands:
Command | Description
-------------
"navigate [page_code]" | Pindah ke halaman dengan kode page_code
"read" | Bacakan isi halaman
"flashcard_next" | Pindah ke flashcard selanjutnya
"flashcard_previous" | Kembali ke flashcard sebelumnya
"flashcard_read_question" | Membaca flashcard saat ini
"flashcard_read_answer" | Membaca jawaban saat ini
"flashcard_show_answer" | Menampilkan jawaban
"flashcard_show_question" | Menampilkan flashcard
"back" | Kembali ke halaman sebelumnya

Available [page_code] values:
Code | Keyword / Description
-----------------------
lanpage | Landing page
menu | Menu, dashboard, main page, beranda, or halaman utama
material |  Material, materi, halaman utama materi, or pelajaran
settings | Settings, pengaturan, preferences, preferensi, or atur akun
`;

const QNA_COMMANDS = `
Available Commands:
Command | Description
-------------
"navigate [page_code]" | Pindah ke halaman dengan kode page_code
"read" | Bacakan isi halaman
"back" | Kembali ke halaman sebelumnya

Available [page_code] values:
Code | Keyword / Description
-----------------------
lanpage | Landing page
menu | Menu, dashboard, main page, beranda, or halaman utama
material |  Material, materi, halaman utama materi, or pelajaran
settings | Settings, pengaturan, preferences, preferensi, or atur akun
`;

export type MaterialFetch = Prisma.MaterialGetPayload<{
  include: {
    materialContent: true;
    flashcard: true;
    _count: {
      select: { userQuestion: true };
    };
  };
}>;

type GetCommandProps = {
  materials?: MaterialFetch[];
};

export function getCommands(pageCode: string, props?: GetCommandProps): string {
  switch (pageCode) {
    case "lanpage":
      return LANDING_PAGE_COMMANDS;
    case "menu":
      return MENU_PAGE_COMMANDS;
    case "material":
      return (
        MATERIAL_PAGE_COMMANDS + parseMaterialToCodes(props?.materials || [])
      );
    case "material_detail":
      return MATERIAL_DETAIL_PAGE_COMMANDS;
    case "settings":
      return SETTING_PAGE_COMMANDS;
    case "flashcard":
      return FLASHCARD_COMMANDS;
    case "qna":
      return QNA_COMMANDS;
  }

  return "";
}

function parseMaterialToCodes(materials: MaterialFetch[]) {
  let outStr = "";
  let m: MaterialFetch;
  for (let i = 0; i < materials.length; i++) {
    m = materials[i];
    outStr += outStr + m.code + " | " + m.title + "\n";
  }
  return outStr;
}

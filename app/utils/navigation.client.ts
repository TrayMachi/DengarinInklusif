const PAGE_CODES = [
  "lanpage",
  "menu",
  "material",
  "material_detail",
  "settings",
];

export const pageRoutes: { [key: string]: (arg0?: any) => string } = {
  lanpage: () => "/",
  menu: () => "/menu",
  material: () => "/menu/materi",
  material_detail: (code: string) => `/menu/materi/${code}`,
  settings: () => "/menu/pengaturan",
};

export function validateCommand(commandStr: string): boolean {
  const command = commandStr.split(" ");

  if (command.length < 1) {
    return false;
  }

  if (command[0] === "navigate") {
    return command.length >= 2 && PAGE_CODES.includes(command[1]);
  }

  if (command[0].startsWith("flashcard_")) {
    return true;
  }

  if (command[0].startsWith("material_")) {
    return true;
  }

  return false;
}

export function getRoute(arg1: string, arg2?: string) {
  if (!(arg1 in pageRoutes)) {
    return "";
  }

  if (arg1 !== "material_detail") return pageRoutes[arg1]();

  if (!arg2) return "";

  return pageRoutes[arg1](arg2);
}

const COMMAND_LIST = ["navigate", "upload"];
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

  if (command.length < 2 || !COMMAND_LIST.includes(command[0])) {
    return false;
  }

  if (command[0] === "navigate") {
    return PAGE_CODES.includes(command[1]);
  }

  return false;
}

export function getRoute(arg1: string, arg2?: string) {
  if (!(arg1 in pageRoutes)) {
    return "";
  }

  if (arg1 !== "menu_detail") return pageRoutes[arg1]();

  if (!arg2) return "";

  return pageRoutes[arg1](arg2);
}

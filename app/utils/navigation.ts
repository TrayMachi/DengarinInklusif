const COMMAND_LIST = ["navigate", "upload"];
const PAGE_CODES = [
  "lanpage",
  "menu",
  "material",
  "material_detail",
  "settings",
];

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

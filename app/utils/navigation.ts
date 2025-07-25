const COMMAND_LIST = [
  "navigate",
  "upload",
  "flashcard_next",
  "flashcard_previous",
  "flashcard_read_question",
  "flashcard_read_answer",
  "flashcard_show_answer",
  "flashcard_show_question",
];

const PAGE_CODES = [
  "lanpage",
  "menu",
  "material",
  "material_detail",
  "settings",
];

export function validateCommand(commandStr: string): boolean {
  const command = commandStr.split(" ");

  if (command.length < 1 || !COMMAND_LIST.includes(command[0])) {
    return false;
  }

  if (command[0] === "navigate") {
    return command.length >= 2 && PAGE_CODES.includes(command[1]);
  }

  if (command[0].startsWith("flashcard_")) {
    return true;
  }

  return false;
}

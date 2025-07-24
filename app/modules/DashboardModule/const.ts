import type { LucideIcon } from "lucide-react";
import {
  Book,
  BookOpen,
  Building2,
  MailQuestion,
  MessageCircleQuestion,
  Pickaxe,
  Rocket,
  Settings,
  Star,
  Trophy,
  UserCog,
  UserPlus,
  Users,
} from "lucide-react";

export interface SidebarItem {
  title: string;
  route: string;
  tooltip: string;
  icon: LucideIcon;
}

export const sidebarItems: SidebarItem[] = [
  {
    title: "Materi",
    route: "/menu/materi",
    tooltip: "Materi untuk memulai kamu belajar",
    icon: BookOpen,
  },
  {
    title: "Pengaturan",
    route: "/menu/pengaturan",
    tooltip: "Atur akun dan preferensi kamu",
    icon: Settings,
  },
];

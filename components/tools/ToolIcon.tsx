import type { ToolId } from "@/lib/tools/config";
import {
  Beef,
  Flame,
  PieChart,
  Scale,
  Percent,
  Dumbbell,
  Trophy,
  Droplets,
  TrendingDown,
  FlaskConical,
  type LucideIcon,
} from "lucide-react";

export const TOOL_ICONS: Record<ToolId, LucideIcon> = {
  protein: Flame,
  tdee: Flame,
  macro: PieChart,
  bmi: Scale,
  bodyfat: Percent,
  lbm: Dumbbell,
  orm: Trophy,
  water: Droplets,
  deficit: TrendingDown,
  creatine: FlaskConical,
};

export function ToolIcon({ id, className = "w-6 h-6", size = 24 }: { id: ToolId; className?: string; size?: number }) {
  const Icon = TOOL_ICONS[id] || Flame;
  return <Icon className={className} size={size} />;
}

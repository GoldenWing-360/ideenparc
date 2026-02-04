import {
  Sprout,
  Wrench,
  TrendingUp,
  Gem,
  Trophy,
  Star,
  Lightbulb,
  Zap,
  HelpCircle,
  FileBarChart,
  Mail,
  Calendar,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  type LucideIcon,
} from 'lucide-react';

export type IconKey =
  | 'sprout'
  | 'wrench'
  | 'trendingUp'
  | 'gem'
  | 'trophy'
  | 'star'
  | 'lightbulb'
  | 'zap'
  | 'helpCircle'
  | 'fileBarChart'
  | 'mail'
  | 'calendar'
  | 'checkCircle'
  | 'arrowLeft'
  | 'arrowRight'
  | 'rotateCcw';

const iconMap: Record<IconKey, LucideIcon> = {
  sprout: Sprout,
  wrench: Wrench,
  trendingUp: TrendingUp,
  gem: Gem,
  trophy: Trophy,
  star: Star,
  lightbulb: Lightbulb,
  zap: Zap,
  helpCircle: HelpCircle,
  fileBarChart: FileBarChart,
  mail: Mail,
  calendar: Calendar,
  checkCircle: CheckCircle2,
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  rotateCcw: RotateCcw,
};

export function getIcon(key: IconKey): LucideIcon {
  return iconMap[key];
}

export default iconMap;

import { motion, useReducedMotion } from 'framer-motion';
import {
  Activity,
  BarChart3,
  FileStack,
  Globe,
  LayoutDashboard,
  ShieldBan,
  type LucideIcon,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface SidebarItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

const items: SidebarItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/blocking-rules', label: 'Blocking Rules', icon: ShieldBan },
  { to: '/performance', label: 'Engine Performance', icon: Activity },
  { to: '/pcap-files', label: 'PCAP Files', icon: FileStack },
  { to: '/recent-packets', label: 'Recent Packets', icon: BarChart3 },
  { to: '/domains', label: 'Detected Domains', icon: Globe },
];

export function Sidebar() {
  const reduceMotion = useReducedMotion();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-dt-border bg-[#0a100f] px-4 py-5 lg:block">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, x: -8 }}
        animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
      >
        <p className="text-lg font-semibold tracking-tight text-dt-text">DeepTrace</p>
        <p className="mt-1 text-xs uppercase tracking-[0.12em] text-dt-muted">Phase 3 Frontend Shell</p>
      </motion.div>

      <nav className="mt-8 space-y-1" aria-label="Sidebar navigation">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'border-emerald-700/80 bg-emerald-900/20 text-emerald-300'
                  : 'border-transparent text-dt-muted hover:border-dt-border hover:bg-dt-panelAlt hover:text-dt-text',
              )
            }
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export const mobileNavItems = items;

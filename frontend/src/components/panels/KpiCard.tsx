import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, ShieldAlert } from 'lucide-react';
import { cn } from '../../lib/utils';

type Trend = 'up' | 'down' | 'danger';

interface KpiCardProps {
  label: string;
  value: string;
  delta: string;
  trend: Trend;
}

const trendStyles: Record<Trend, string> = {
  up: 'text-emerald-300',
  down: 'text-teal-300',
  danger: 'text-rose-300',
};

export function KpiCard({ label, value, delta, trend }: KpiCardProps) {
  const reduceMotion = useReducedMotion();

  const TrendIcon = trend === 'danger' ? ShieldAlert : trend === 'up' ? ArrowUpRight : ArrowDownRight;

  return (
    <motion.article
      whileHover={reduceMotion ? undefined : { y: -2 }}
      transition={{ duration: 0.16 }}
      className="panel px-4 py-3"
    >
      <p className="text-xs uppercase tracking-[0.12em] text-dt-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-dt-text">{value}</p>
      <p className={cn('mt-2 inline-flex items-center gap-1 text-xs font-medium', trendStyles[trend])}>
        <TrendIcon className="h-3.5 w-3.5" />
        {delta}
      </p>
    </motion.article>
  );
}

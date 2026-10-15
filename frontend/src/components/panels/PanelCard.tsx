import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface PanelCardProps {
  title: string;
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function PanelCard({ title, meta, children, className }: PanelCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn('panel p-4', className)}
    >
      <header className="mb-3 flex items-center justify-between">
        <h2 className="panel-title">{title}</h2>
        {meta}
      </header>
      {children}
    </motion.section>
  );
}

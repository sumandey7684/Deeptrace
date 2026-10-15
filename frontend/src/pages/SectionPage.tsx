import { motion, useReducedMotion } from 'framer-motion';
import { PanelCard } from '../components/panels/PanelCard';
import { EmptyState, ErrorState, SkeletonState } from '../components/states/PanelStates';
import { fixtureMetaLabel } from '../lib/fixtures';

export function SectionPage({ title }: { title: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <PanelCard title={title} meta={<span className="state-label">{fixtureMetaLabel}</span>}>
        <p className="text-sm text-dt-muted">Dedicated {title.toLowerCase()} route with placeholder shell panel.</p>
      </PanelCard>

      <div className="grid gap-4 md:grid-cols-3">
        <PanelCard title="Loading State Example">
          <SkeletonState />
        </PanelCard>
        <PanelCard title="Empty State Example">
          <EmptyState />
        </PanelCard>
        <PanelCard title="Error State Example">
          <ErrorState />
        </PanelCard>
      </div>
    </motion.div>
  );
}

import { ReactNode } from 'react';

export function ChartPanel({ children }: { children: ReactNode }) {
  return <div className="h-60 w-full">{children}</div>;
}

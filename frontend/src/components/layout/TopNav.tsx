import { Bell, Menu, Search, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { mobileNavItems } from './Sidebar';

const routeTitles: Record<string, string> = {
  '/': 'Dashboard Overview',
  '/blocking-rules': 'Blocking Rules',
  '/performance': 'Engine Performance',
  '/pcap-files': 'PCAP Files',
  '/recent-packets': 'Recent Packets',
  '/domains': 'Detected Domains',
};

export function TopNav() {
  const location = useLocation();
  const title = routeTitles[location.pathname] ?? 'DeepTrace';

  return (
    <header className="sticky top-0 z-20 border-b border-dt-border bg-dt-bg/90 px-4 py-3 backdrop-blur lg:px-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.13em] text-dt-muted">Deep packet inspection</p>
          <h1 className="text-lg font-semibold tracking-tight text-dt-text">{title}</h1>
        </div>

        <div className="hidden items-center gap-2 rounded-md border border-dt-border bg-dt-panelAlt px-3 py-1.5 text-xs text-dt-muted md:flex">
          <Search className="h-3.5 w-3.5" />
          <span>Search events or domains</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-dt-border bg-dt-panelAlt text-dt-muted hover:text-dt-text"
            aria-label="Security status"
          >
            <ShieldCheck className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-dt-border bg-dt-panelAlt text-dt-muted hover:text-dt-text"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>
        </div>
      </div>

      <nav className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 lg:hidden" aria-label="Mobile navigation">
        <span className="inline-flex items-center gap-1 text-xs text-dt-muted">
          <Menu className="h-3.5 w-3.5" /> Sections:
        </span>
        {mobileNavItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="rounded-md border border-dt-border bg-dt-panelAlt px-2 py-1 text-xs text-dt-muted hover:text-dt-text"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

import { motion, useReducedMotion } from 'framer-motion';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartPanel } from '../components/charts/ChartPanel';
import { PanelCard } from '../components/panels/PanelCard';
import { KpiCard } from '../components/panels/KpiCard';
import {
  appBreakdown,
  blockingRules,
  domains,
  fixtureMetaLabel,
  kpiFixtures,
  packetFlow,
  pcapFiles,
  performanceStats,
  protocolDistribution,
  recentPackets,
} from '../lib/fixtures';

const pieColors = ['#10b981', '#14b8a6', '#34d399', '#059669', '#6ee7b7'];

export function DashboardPage() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div initial={reduceMotion ? false : { opacity: 0 }} animate={reduceMotion ? undefined : { opacity: 1 }}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <span className="state-label">{fixtureMetaLabel}</span>
        <p className="text-xs text-dt-muted">No backend integration in this phase.</p>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpiFixtures.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-12">
        <PanelCard title="Protocol Distribution" className="xl:col-span-4">
          <ChartPanel>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={protocolDistribution} dataKey="value" nameKey="name" innerRadius={50} outerRadius={76} paddingAngle={3}>
                  {protocolDistribution.map((entry, index) => (
                    <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#0f1715', border: '1px solid #22312d', borderRadius: 8 }}
                  itemStyle={{ color: '#d1e5df' }}
                  labelStyle={{ color: '#8ca7a0' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartPanel>
        </PanelCard>

        <PanelCard title="Application Breakdown" className="xl:col-span-4">
          <ChartPanel>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appBreakdown} barGap={8}>
                <CartesianGrid stroke="#1f2e2a" vertical={false} />
                <XAxis dataKey="app" tick={{ fill: '#8ca7a0', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#8ca7a0', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0f1715', border: '1px solid #22312d', borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="allowed" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="blocked" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>
        </PanelCard>

        <PanelCard title="Packet Flow" className="xl:col-span-4">
          <ChartPanel>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={packetFlow}>
                <CartesianGrid stroke="#1f2e2a" vertical={false} />
                <XAxis dataKey="t" tick={{ fill: '#8ca7a0', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#8ca7a0', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0f1715', border: '1px solid #22312d', borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line dataKey="allow" stroke="#10b981" strokeWidth={2} dot={false} />
                <Line dataKey="block" stroke="#ef4444" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartPanel>
        </PanelCard>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-12">
        <PanelCard title="Blocking Rules" className="xl:col-span-4">
          <ul className="space-y-2">
            {blockingRules.map((rule) => (
              <li key={rule.id} className="rounded-md border border-dt-border bg-dt-panelAlt px-3 py-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold text-dt-text">{rule.name}</p>
                    <p className="mt-1 text-[11px] text-dt-muted">{rule.id}</p>
                  </div>
                  <span className="rounded bg-rose-900/35 px-2 py-0.5 text-[11px] text-rose-300">{rule.action}</span>
                </div>
                <p className="mt-1 text-[11px] text-dt-muted">Hits: {rule.hits}</p>
              </li>
            ))}
          </ul>
        </PanelCard>

        <PanelCard title="Engine Performance" className="xl:col-span-3">
          <div className="space-y-2">
            {performanceStats.map((stat) => (
              <div key={stat.label} className="rounded-md border border-dt-border bg-dt-panelAlt px-3 py-2">
                <p className="text-[11px] uppercase tracking-[0.12em] text-dt-muted">{stat.label}</p>
                <p className="mt-1 text-sm font-semibold text-dt-text">{stat.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 h-24">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={packetFlow}>
                <defs>
                  <linearGradient id="flowGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.42} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="allow" stroke="#10b981" fill="url(#flowGrad)" strokeWidth={1.4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </PanelCard>

        <PanelCard title="PCAP Files" className="xl:col-span-5">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs">
              <caption className="sr-only">PCAP fixtures for UI shell</caption>
              <thead className="text-dt-muted">
                <tr>
                  <th className="pb-2 font-medium">File</th>
                  <th className="pb-2 font-medium">Size</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {pcapFiles.map((row) => (
                  <tr key={row.file} className="border-t border-dt-border">
                    <td className="py-2 pr-2 text-dt-text">{row.file}</td>
                    <td className="py-2 pr-2 text-dt-muted">{row.size}</td>
                    <td className="py-2">
                      <span className="rounded bg-emerald-900/30 px-2 py-0.5 text-[11px] text-emerald-300">{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PanelCard>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-12">
        <PanelCard title="Recent Packets" className="xl:col-span-7">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs">
              <caption className="sr-only">Recent packet fixtures for UI shell</caption>
              <thead className="text-dt-muted">
                <tr>
                  <th className="pb-2 font-medium">Time</th>
                  <th className="pb-2 font-medium">Source</th>
                  <th className="pb-2 font-medium">Destination</th>
                  <th className="pb-2 font-medium">Protocol</th>
                  <th className="pb-2 font-medium">Decision</th>
                </tr>
              </thead>
              <tbody>
                {recentPackets.map((pkt, index) => (
                  <motion.tr
                    key={`${pkt.ts}-${index}`}
                    whileHover={reduceMotion ? undefined : { backgroundColor: '#16221f' }}
                    className="border-t border-dt-border"
                  >
                    <td className="py-2 pr-2 text-dt-muted">{pkt.ts}</td>
                    <td className="py-2 pr-2 text-dt-text">{pkt.src}</td>
                    <td className="py-2 pr-2 text-dt-text">{pkt.dst}</td>
                    <td className="py-2 pr-2 text-dt-muted">{pkt.proto}</td>
                    <td className="py-2">
                      <span
                        className={
                          pkt.decision === 'Allow'
                            ? 'rounded bg-emerald-900/30 px-2 py-0.5 text-[11px] text-emerald-300'
                            : pkt.decision === 'Warn'
                              ? 'rounded bg-rose-900/35 px-2 py-0.5 text-[11px] text-rose-300'
                              : 'rounded bg-red-900/40 px-2 py-0.5 text-[11px] text-red-300'
                        }
                      >
                        {pkt.decision}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </PanelCard>

        <PanelCard title="Detected Domains" className="xl:col-span-5">
          <ul className="space-y-2">
            {domains.map((item) => (
              <li key={item.domain} className="flex items-center justify-between rounded-md border border-dt-border bg-dt-panelAlt px-3 py-2">
                <span className="text-xs text-dt-text">{item.domain}</span>
                <span
                  className={
                    item.risk === 'High'
                      ? 'rounded bg-red-900/40 px-2 py-0.5 text-[11px] text-red-300'
                      : item.risk === 'Medium'
                        ? 'rounded bg-rose-900/35 px-2 py-0.5 text-[11px] text-rose-300'
                        : 'rounded bg-teal-900/35 px-2 py-0.5 text-[11px] text-teal-300'
                  }
                >
                  {item.risk}
                </span>
              </li>
            ))}
          </ul>
        </PanelCard>
      </section>
    </motion.div>
  );
}

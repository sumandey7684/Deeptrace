export const fixtureMetaLabel = 'Temporary fixture data (Phase 3 visual shell only)';

export const kpiFixtures = [
  { label: 'Packets / sec', value: '24,391', delta: '+6.4%', trend: 'up' as const },
  { label: 'Blocked Flows', value: '1,048', delta: '+3.2%', trend: 'danger' as const },
  { label: 'Active Rules', value: '128', delta: '+2', trend: 'up' as const },
  { label: 'Engine Latency', value: '4.8ms', delta: '-0.5ms', trend: 'down' as const },
];

export const protocolDistribution = [
  { name: 'HTTPS', value: 46 },
  { name: 'DNS', value: 14 },
  { name: 'QUIC', value: 19 },
  { name: 'TCP', value: 13 },
  { name: 'Other', value: 8 },
];

export const appBreakdown = [
  { app: 'Web', allowed: 84, blocked: 14 },
  { app: 'Streaming', allowed: 62, blocked: 29 },
  { app: 'Messaging', allowed: 53, blocked: 9 },
  { app: 'Gaming', allowed: 33, blocked: 12 },
  { app: 'File Sync', allowed: 47, blocked: 5 },
];

export const packetFlow = [
  { t: '09:00', allow: 1200, block: 96 },
  { t: '09:30', allow: 1480, block: 101 },
  { t: '10:00', allow: 1601, block: 112 },
  { t: '10:30', allow: 1810, block: 148 },
  { t: '11:00', allow: 1754, block: 137 },
  { t: '11:30', allow: 1992, block: 169 },
  { t: '12:00', allow: 1844, block: 152 },
];

export const blockingRules = [
  { id: 'R-001', name: 'Known C2 Beacon Domain', action: 'Blocked', hits: 343 },
  { id: 'R-011', name: 'Suspicious DNS Exfil Pattern', action: 'Blocked', hits: 201 },
  { id: 'R-024', name: 'Geo Restricted Region', action: 'Blocked', hits: 178 },
  { id: 'R-089', name: 'Non-compliant TLS Fingerprint', action: 'Warn', hits: 41 },
];

export const performanceStats = [
  { label: 'Parser Threads', value: '8 / 8' },
  { label: 'CPU Usage', value: '37%' },
  { label: 'Memory Footprint', value: '418MB' },
  { label: 'Queue Backpressure', value: 'Low' },
];

export const pcapFiles = [
  { file: 'edge-lab-01.pcap', size: '183 MB', status: 'Processed' },
  { file: 'outbound-watch.pcap', size: '74 MB', status: 'Queued' },
  { file: 'dns-noise-sample.pcap', size: '28 MB', status: 'Processed' },
];

export const recentPackets = [
  { ts: '12:04:12', src: '10.0.3.21', dst: '104.16.133.229', proto: 'HTTPS', decision: 'Allow' },
  { ts: '12:04:11', src: '10.0.2.7', dst: '198.51.100.66', proto: 'DNS', decision: 'Block' },
  { ts: '12:04:11', src: '10.0.1.8', dst: '151.101.65.67', proto: 'QUIC', decision: 'Allow' },
  { ts: '12:04:10', src: '10.0.6.14', dst: '203.0.113.42', proto: 'TCP', decision: 'Warn' },
];

export const domains = [
  { domain: 'auth.service-edge.dev', risk: 'Low' },
  { domain: 'cdn-stream-latam.net', risk: 'Medium' },
  { domain: 'zq9-anom-route.info', risk: 'High' },
  { domain: 'api.control-plane.internal', risk: 'Low' },
];

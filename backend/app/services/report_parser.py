import re
from app.models import AnalysisReport, ApplicationStat, DomainEntry, ThreadStat


def _number(text: str) -> int:
    return int(text.replace(",", ""))


def parse_report(stdout: str) -> AnalysisReport:
    values: dict[str, int] = {}
    labels = {
        "Total Packets": "total_packets",
        "Total Bytes": "total_bytes",
        "TCP Packets": "tcp_packets",
        "UDP Packets": "udp_packets",
        "Forwarded": "forwarded_packets",
        "Dropped": "dropped_packets",
    }
    for line in stdout.splitlines():
        for label, key in labels.items():
            match = re.search(rf"{re.escape(label)}:\s*([\d,]+)", line)
            if match:
                values[key] = _number(match.group(1))

    applications: list[ApplicationStat] = []
    in_apps = False
    domains: list[DomainEntry] = []
    in_domains = False
    threads: list[ThreadStat] = []
    for line in stdout.splitlines():
        stripped = line.strip()
        if "APPLICATION BREAKDOWN" in stripped:
            in_apps, in_domains = True, False
            continue
        if "[Detected Domains/SNIs]" in stripped:
            in_apps, in_domains = False, True
            continue
        if "THREAD STATISTICS" in stripped:
            in_apps, in_domains = False, False
            continue
        if in_apps:
            match = re.match(r"^([A-Za-z][A-Za-z0-9 /+.-]*?)\s+([\d,]+)\s+([\d.]+)%", stripped)
            if match:
                applications.append(ApplicationStat(name=match.group(1).strip(), packets=_number(match.group(2)), percentage=float(match.group(3))))
        elif in_domains:
            match = re.match(r"^-\s+(.+?)\s+->\s+(.+)$", stripped)
            if match:
                domains.append(DomainEntry(domain=match.group(1), application=match.group(2)))
        else:
            match = re.match(r"^(LB\d+|FP\d+)\s+(?:dispatched|processed):\s*([\d,]+)", stripped)
            if match:
                threads.append(ThreadStat(name=match.group(1), processed=_number(match.group(2))))

    missing = [key for key in labels.values() if key not in values]
    if missing:
        raise ValueError(f"Engine report is missing fields: {', '.join(missing)}")
    return AnalysisReport(**values, thread_statistics=threads, applications=applications, domains=domains)

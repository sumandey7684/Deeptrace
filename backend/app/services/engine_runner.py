import re
import subprocess
from pathlib import Path
from app.config import Settings
from app.models import AnalysisReport
from app.services.report_parser import parse_report


class EngineError(RuntimeError):
    pass


class EngineTimeout(EngineError):
    pass


def engine_status(settings: Settings) -> dict:
    if not settings.engine_path.is_file():
        return {"available": False, "path": str(settings.engine_path), "detail": "Engine executable is missing"}
    try:
        result = subprocess.run(
            [str(settings.engine_path), "--help"],
            cwd=str(settings.project_root),
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=min(settings.engine_timeout_seconds, 10),
            check=False,
        )
    except OSError as exc:
        return {"available": False, "path": str(settings.engine_path), "detail": f"Engine could not start: {exc}"}
    version_match = re.search(r"DPI Engine v([^\s]+)", result.stdout + result.stderr, re.IGNORECASE)
    return {
        "available": result.returncode in (0, 1),
        "path": str(settings.engine_path),
        "version": version_match.group(1) if version_match else None,
        "detail": "Engine executable is available" if result.returncode in (0, 1) else "Engine help command failed",
    }


def run_analysis(settings: Settings, input_path: Path, output_path: Path, rules: list[dict]) -> AnalysisReport:
    args = [str(settings.engine_path), str(input_path), str(output_path)]
    for rule in rules:
        if not rule["enabled"]:
            continue
        flag = {"ip": "--block-ip", "app": "--block-app", "domain": "--block-domain"}[rule["type"]]
        args.extend([flag, rule["value"]])
    try:
        result = subprocess.run(
            args,
            cwd=str(settings.project_root),
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=settings.engine_timeout_seconds,
            check=False,
        )
    except subprocess.TimeoutExpired as exc:
        raise EngineTimeout(f"Engine timed out after {settings.engine_timeout_seconds:g} seconds") from exc
    except OSError as exc:
        raise EngineError(f"Engine could not start: {exc}") from exc
    if result.returncode != 0:
        detail = (result.stderr or result.stdout).strip() or f"exit code {result.returncode}"
        raise EngineError(f"Engine failed: {detail}")
    if not output_path.is_file():
        raise EngineError("Engine completed without creating an output PCAP")
    # The shipped Windows build writes its report to stderr while some builds
    # write to stdout, so parse both streams without relying on one channel.
    return parse_report("\n".join(part for part in (result.stdout, result.stderr) if part))

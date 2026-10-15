from dataclasses import dataclass
from pathlib import Path
import os


@dataclass(frozen=True)
class Settings:
    project_root: Path
    engine_path: Path
    rules_path: Path
    analysis_dir: Path
    engine_timeout_seconds: float = 300.0

    @classmethod
    def from_environment(cls) -> "Settings":
        project_root = Path(
            os.environ.get("DEEPTRACE_PROJECT_ROOT", Path(__file__).resolve().parents[2])
        ).resolve()
        engine_path = Path(
            os.environ.get("DEEPTRACE_ENGINE_PATH", project_root / "dpi_engine.exe")
        ).resolve()
        analysis_dir = Path(
            os.environ.get("DEEPTRACE_ANALYSIS_DIR", project_root / ".deeptrace-runs")
        ).resolve()
        rules_path = Path(
            os.environ.get("DEEPTRACE_RULES_PATH", analysis_dir / "rules.json")
        ).resolve()
        timeout = float(os.environ.get("DEEPTRACE_ENGINE_TIMEOUT", "300"))
        if timeout <= 0:
            raise ValueError("DEEPTRACE_ENGINE_TIMEOUT must be positive")
        return cls(project_root, engine_path, rules_path, analysis_dir, timeout)

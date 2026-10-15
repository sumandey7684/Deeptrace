import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

BACKEND = Path(__file__).resolve().parents[1]
PROJECT = BACKEND.parent
sys.path.insert(0, str(BACKEND))

from app.config import Settings
from app.main import create_app


@pytest.fixture
def app(tmp_path: Path):
    settings = Settings(
        project_root=PROJECT,
        engine_path=PROJECT / "dpi_engine.exe",
        rules_path=tmp_path / "rules.json",
        analysis_dir=tmp_path / "analyses",
        engine_timeout_seconds=30,
    )
    return create_app(settings)


@pytest.fixture
def client(app):
    with TestClient(app) as test_client:
        yield test_client

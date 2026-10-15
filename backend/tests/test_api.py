from pathlib import Path

from app.services.engine_runner import EngineError, EngineTimeout


def test_health_and_engine_status(client):
    health = client.get("/api/health")
    status = client.get("/api/engine/status")

    assert health.status_code == 200
    assert health.json()["status"] == "ok"
    assert health.json()["engine"]["available"] is True
    assert status.json()["version"] == "2.0"


def test_successful_analysis_against_sample_pcap(client, app):
    response = client.post("/api/analyses", json={"input_file": "test_dpi.pcap"})

    assert response.status_code == 200, response.text
    body = response.json()
    assert body["report"]["total_packets"] == 77
    assert body["report"]["total_bytes"] == 5738
    assert body["report"]["tcp_packets"] == 73
    assert body["report"]["udp_packets"] == 4
    assert body["report"]["forwarded_packets"] == 77
    assert body["report"]["dropped_packets"] == 0
    assert len(body["packets"]) == 77
    output_path = Path(body["output_file"])
    assert output_path.is_file()
    assert output_path.stat().st_size == 6994


def test_ip_blocking_is_applied_by_engine(client):
    created = client.post(
        "/api/rules",
        json={"type": "ip", "value": "192.168.1.50"},
    )
    assert created.status_code == 201

    response = client.post("/api/analyses", json={"input_file": "test_dpi.pcap"})

    assert response.status_code == 200, response.text
    report = response.json()["report"]
    assert report["total_packets"] == 77
    assert report["forwarded_packets"] == 72
    assert report["dropped_packets"] == 5


def test_invalid_and_malformed_capture_paths(client, app):
    outside = client.post("/api/analyses", json={"input_file": str(Path("C:/Windows/not-a-capture.pcap"))})
    assert outside.status_code == 400

    malformed = app.state.settings.project_root / "backend" / "tests" / "malformed-test.pcap"
    malformed.write_bytes(b"not a pcap")
    try:
        response = client.post("/api/analyses", json={"input_file": str(malformed)})
        assert response.status_code == 400
    finally:
        malformed.unlink(missing_ok=True)


def test_engine_timeout_returns_504(client, monkeypatch):
    from app.routers import analyses

    def timeout(*args, **kwargs):
        raise EngineTimeout("Engine timed out")

    monkeypatch.setattr(analyses, "run_analysis", timeout)
    response = client.post("/api/analyses", json={"input_file": "test_dpi.pcap"})
    assert response.status_code == 504
    assert response.json()["detail"] == "Engine timed out"


def test_engine_failure_returns_502(client, monkeypatch):
    from app.routers import analyses

    def failure(*args, **kwargs):
        raise EngineError("Engine failed: exit code 7")

    monkeypatch.setattr(analyses, "run_analysis", failure)
    response = client.post("/api/analyses", json={"input_file": "test_dpi.pcap"})
    assert response.status_code == 502
    assert "exit code 7" in response.json()["detail"]


def test_rule_validation_and_lifecycle(client):
    invalid_ip = client.post("/api/rules", json={"type": "ip", "value": "not-an-ip"})
    invalid_app = client.post("/api/rules", json={"type": "app", "value": "NotAnEngineApp"})
    assert invalid_ip.status_code == 422
    assert invalid_app.status_code == 422

    created = client.post("/api/rules", json={"type": "domain", "value": "*.example.com"})
    assert created.status_code == 201
    rule_id = created.json()["id"]
    updated = client.patch(
        f"/api/rules/{rule_id}",
        json={"type": "domain", "value": "example.org", "enabled": False},
    )
    assert updated.status_code == 200
    assert updated.json()["enabled"] is False
    assert client.delete(f"/api/rules/{rule_id}").status_code == 204

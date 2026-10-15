from datetime import datetime, timezone
from uuid import uuid4
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from app.models import AnalysisResponse
from app.services.engine_runner import EngineError, EngineTimeout, run_analysis
from app.services.paths import PathValidationError, approved_file, validate_pcap
from app.services.pcap_reader import read_packets

router = APIRouter()


class AnalysisRequest(BaseModel):
    input_file: str


@router.post("/analyses", response_model=AnalysisResponse)
def analyze(payload: AnalysisRequest, request: Request) -> AnalysisResponse:
    settings = request.app.state.settings
    try:
        input_path = approved_file(payload.input_file, settings.project_root)
        validate_pcap(input_path)
        analysis_id = uuid4().hex
        settings.analysis_dir.mkdir(parents=True, exist_ok=True)
        output_path = settings.analysis_dir / f"{analysis_id}.pcap"
        rules = [rule.model_dump() for rule in request.app.state.rule_store.list()]
        report = run_analysis(settings, input_path, output_path, rules)
        packets = read_packets(input_path)
    except PathValidationError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except EngineTimeout as exc:
        raise HTTPException(status_code=504, detail=str(exc)) from exc
    except EngineError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    return AnalysisResponse(
        id=analysis_id,
        input_file=str(input_path),
        output_file=str(output_path),
        created_at=datetime.now(timezone.utc),
        report=report,
        packets=packets,
    )

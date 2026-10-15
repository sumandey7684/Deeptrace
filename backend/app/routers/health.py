from fastapi import APIRouter, Request
from app.models import EngineStatus, HealthResponse
from app.services.engine_runner import engine_status

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
def health(request: Request) -> HealthResponse:
    return HealthResponse(status="ok", engine=EngineStatus(**engine_status(request.app.state.settings)))


@router.get("/engine/status", response_model=EngineStatus)
def status(request: Request) -> EngineStatus:
    return EngineStatus(**engine_status(request.app.state.settings))

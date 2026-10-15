from fastapi import FastAPI
from app.config import Settings
from app.routers import analyses, health, rules
from app.services.rules import RuleStore


def create_app(settings: Settings | None = None) -> FastAPI:
    app = FastAPI(title="DeepTrace API", version="0.1.0")
    app.state.settings = settings or Settings.from_environment()
    app.state.rule_store = RuleStore(app.state.settings.rules_path)
    app.include_router(health.router, prefix="/api")
    app.include_router(analyses.router, prefix="/api")
    app.include_router(rules.router, prefix="/api")
    return app


app = create_app()

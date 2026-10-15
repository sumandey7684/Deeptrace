from fastapi import APIRouter, HTTPException, Request, status
from app.models import Rule, RuleCreate

router = APIRouter()


@router.get("/rules", response_model=list[Rule])
def list_rules(request: Request) -> list[Rule]:
    return request.app.state.rule_store.list()


@router.post("/rules", response_model=Rule, status_code=status.HTTP_201_CREATED)
def create_rule(payload: RuleCreate, request: Request) -> Rule:
    try:
        return request.app.state.rule_store.add(payload)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc


@router.patch("/rules/{rule_id}", response_model=Rule)
def update_rule(rule_id: str, payload: RuleCreate, request: Request) -> Rule:
    try:
        return request.app.state.rule_store.update(rule_id, payload)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except KeyError as exc:
        raise HTTPException(status_code=404, detail="Rule not found") from exc


@router.delete("/rules/{rule_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_rule(rule_id: str, request: Request) -> None:
    try:
        request.app.state.rule_store.delete(rule_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail="Rule not found") from exc

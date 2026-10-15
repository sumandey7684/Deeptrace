import ipaddress
import json
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4
from app.models import Rule, RuleCreate

SUPPORTED_APPS = {
    "Google", "YouTube", "Facebook", "Instagram", "Twitter/X", "Netflix",
    "Amazon", "Microsoft", "Apple", "WhatsApp", "Telegram", "TikTok",
    "Spotify", "Zoom", "Discord", "GitHub", "Cloudflare", "HTTP", "HTTPS",
    "DNS", "TLS", "QUIC",
}


def validate_rule(rule: RuleCreate) -> RuleCreate:
    value = rule.value.strip()
    if rule.type == "ip":
        try:
            ipaddress.ip_address(value)
        except ValueError as exc:
            raise ValueError("Rule value must be a valid IP address") from exc
    elif rule.type == "app" and value not in SUPPORTED_APPS:
        raise ValueError("Rule value is not supported by the engine")
    elif rule.type == "domain":
        domain = value[2:] if value.startswith("*.") else value
        if not domain or "." not in domain or any(char.isspace() for char in domain):
            raise ValueError("Rule value must be a domain or wildcard domain")
    return rule.model_copy(update={"value": value})


class RuleStore:
    def __init__(self, path: Path):
        self.path = path

    def list(self) -> list[Rule]:
        if not self.path.exists():
            return []
        return [Rule.model_validate(item) for item in json.loads(self.path.read_text(encoding="utf-8"))]

    def save(self, rules: list[Rule]) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.path.write_text(json.dumps([rule.model_dump(mode="json") for rule in rules], indent=2), encoding="utf-8")

    def add(self, payload: RuleCreate) -> Rule:
        rule = Rule(id=uuid4().hex, created_at=datetime.now(timezone.utc), **validate_rule(payload).model_dump())
        rules = self.list()
        rules.append(rule)
        self.save(rules)
        return rule

    def update(self, rule_id: str, payload: RuleCreate) -> Rule:
        validated = validate_rule(payload)
        rules = self.list()
        for index, rule in enumerate(rules):
            if rule.id == rule_id:
                updated = Rule(id=rule.id, created_at=rule.created_at, **validated.model_dump())
                rules[index] = updated
                self.save(rules)
                return updated
        raise KeyError(rule_id)

    def delete(self, rule_id: str) -> None:
        rules = self.list()
        remaining = [rule for rule in rules if rule.id != rule_id]
        if len(remaining) == len(rules):
            raise KeyError(rule_id)
        self.save(remaining)

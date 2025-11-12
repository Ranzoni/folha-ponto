import type Rule from "../../domain/models/rule.model.js"
import type { RuleResponse } from "../../api/models/rule.response.js"

export default function mapToRuleResponse(rule: Rule): RuleResponse {
    return {
        id: rule.id,
        name: rule.name
    } as RuleResponse 
}
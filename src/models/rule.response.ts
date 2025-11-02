import type Rule from "../domain/models/rule.model.js"
import type BaseResponse from "./base.response.js"

export interface RuleResponse extends BaseResponse {
    name: string
}

export default function mapToRuleResponse(rule: Rule): RuleResponse {
    return {
        id: rule.id(),
        name: rule.name(),
        createdAt: rule.createdAt(),
        updatedAt: rule.updatedAt()
    } as RuleResponse 
}
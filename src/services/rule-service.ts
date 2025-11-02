import RuleError from "../domain/errors/rule.error.js"
import Rule from "../domain/models/rule.model.js"
import { saveRule } from "../infra/rules-infra.js"
import mapToRuleResponse, { type RuleResponse } from "../models/rule.response.js"

export default async function createRule(name: string): Promise<RuleResponse | undefined> {
    const rule = new Rule(name)
    
    const ruleCreated = await saveRule(rule)
    if (!ruleCreated)
        throw new RuleError('Fail to recover the rule created')

    return mapToRuleResponse(ruleCreated)
}
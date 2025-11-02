import RuleError from "../domain/errors/rule.error.js"
import Rule from "../domain/models/rule.model.js"
import { getRuleByName, saveRule } from "../infra/rules-infra.js"
import mapToRuleResponse, { type RuleResponse } from "../models/rule.response.js"

export default async function createRule(name: string): Promise<RuleResponse | undefined> {
    await validateCreation(name)

    const rule = new Rule(name)
    const ruleCreated = await saveRule(rule)
    if (!ruleCreated)
        throw new RuleError('Fail to recover the rule created')

    return mapToRuleResponse(ruleCreated)
}

async function validateCreation(name: string): Promise<void> {
    const ruleFound = await getRuleByName(name)
    if (ruleFound)
        RuleError.alreadyExists()
}
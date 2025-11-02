import RuleError from "../domain/errors/rule.error.js"
import Rule from "../domain/models/rule.model.js"
import { alterRule, getById, getRuleByName, saveRule } from "../infra/rules-infra.js"
import mapToRuleResponse, { type RuleResponse } from "../models/rule.response.js"

async function createRule(name: string): Promise<RuleResponse | undefined> {
    await validateRuleRegister(name)

    const rule = new Rule(name)
    const ruleCreated = await saveRule(rule)
    if (!ruleCreated)
        throw new RuleError('Fail to recover the rule created.')

    return mapToRuleResponse(ruleCreated)
}

async function updateRule(id: number, name: string): Promise<RuleResponse | undefined> {
    await validateRuleRegister(name, id)

    const rule = await getById(id)
    if (!rule) 
        RuleError.notFound()
    
    rule!.update(name)
    const ruleUpdated = await alterRule(rule!)
    if (!ruleUpdated)
        throw new RuleError('Fail to recover the rule updated.')
    
    return mapToRuleResponse(ruleUpdated)
}

async function validateRuleRegister(name: string, idToIgnore?: number): Promise<void> {
    const ruleFound = await getRuleByName(name, idToIgnore)
    if (ruleFound)
        RuleError.alreadyExists()
}

async function searchRule(id: number): Promise<RuleResponse | undefined> {
    const rule = await getById(id)
    if (!rule)
        return undefined

    return mapToRuleResponse(rule)
}

export { createRule, updateRule, searchRule }
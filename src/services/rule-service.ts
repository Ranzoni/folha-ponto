import RuleError from "../domain/errors/rule.error.js"
import Rule from "../domain/models/rule.model.js"
import { alterRule, deleteRule, getById, getRuleByName, getRules, saveRule } from "../infra/rules-infra.js"
import type { RuleResponse } from "../api/models/rule.response.js"
import { mapToQuery } from "./mappers/query.mapper.js"
import mapToRuleResponse from "./mappers/rule.mapper.js"
import type { FilterRequest } from "../api/models/filter.request.js"

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

async function removeRule(id: number): Promise<void> {
    const rule = await getById(id)
    if (!rule) 
        RuleError.notFound()
    
    const removed = await deleteRule(rule!.id())
    if (!removed)
        throw new RuleError("Can't remove the rule.")
}

async function searchRule(id: number): Promise<RuleResponse | undefined> {
    const rule = await getById(id)
    if (!rule)
        return undefined

    return mapToRuleResponse(rule)
}

async function searchRules(filter: FilterRequest): Promise<RuleResponse[]> {
    const query = mapToQuery(filter)
    const rules = await getRules(query.query)
    return rules.map(rule => mapToRuleResponse(rule))
}

export { createRule, updateRule, removeRule, searchRule, searchRules }
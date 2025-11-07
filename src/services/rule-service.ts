import RuleError from "../domain/errors/rule.error.js"
import Rule from "../domain/models/rule.model.js"
import type { RuleResponse } from "../api/models/rule.response.js"
import { mapToQuery } from "./mappers/query.mapper.js"
import mapToRuleResponse from "./mappers/rule.mapper.js"
import type { FilterRequest } from "../api/models/filter.request.js"
import type IRuleRepository from "../domain/models/interfaces/rules/rules-repository.interface.js"

export default class RuleService {
    private _ruleRepository: IRuleRepository

    constructor(ruleRepository: IRuleRepository) {
        this._ruleRepository = ruleRepository     
    }

    async createRule(name: string): Promise<RuleResponse | undefined> {
        await this.validateRuleRegister(name)

        const rule = new Rule(name)
        const ruleCreated = await this._ruleRepository.save(rule)
        if (!ruleCreated)
            throw new RuleError('Fail to recover the rule created.')

        return mapToRuleResponse(ruleCreated)
    }

    async updateRule(id: number, name: string): Promise<RuleResponse | undefined> {
        await this.validateRuleRegister(name, id)

        const rule = await this._ruleRepository.get(id)
        if (!rule) 
            RuleError.notFound()
        
        rule!.update(name)
        const ruleUpdated = await this._ruleRepository.update(rule!)
        if (!ruleUpdated)
            throw new RuleError('Fail to recover the rule updated.')
        
        return mapToRuleResponse(ruleUpdated)
    }
    
    async removeRule(id: number): Promise<void> {
        const rule = await this._ruleRepository.get(id)
        if (!rule) 
            RuleError.notFound()
        
        const removed = await this._ruleRepository.delete(rule!)
        if (!removed)
            throw new RuleError("Can't remove the rule.")
    }
    
    async searchRule(id: number): Promise<RuleResponse | undefined> {
        const rule = await this._ruleRepository.get(id)
        if (!rule)
            return undefined
        
        return mapToRuleResponse(rule)
    }
    
    async searchRules(filter: FilterRequest): Promise<RuleResponse[]> {
        const query = mapToQuery(filter)
        const rules = await this._ruleRepository.getMany(query.query)
        return rules.map(rule => mapToRuleResponse(rule))
    }

    private async validateRuleRegister(name: string, idToIgnore?: number): Promise<void> {
        const ruleFound = await this._ruleRepository.getByName(name, idToIgnore)
        if (ruleFound)
            RuleError.alreadyExists()
    }
}
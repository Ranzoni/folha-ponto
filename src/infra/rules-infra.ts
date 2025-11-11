import type IRuleRepository from "../domain/models/interfaces/rules-repository.interface.js"
import Rule from "../domain/models/rule.model.js"
import type { Query } from "../domain/shared/query.js"
import BaseRepository from "./shared/base-repository.js"
import { getMany, getOne, remove, save, update } from "./context-infra.js"

export default class RuleRepository extends BaseRepository<Rule> implements IRuleRepository {
    async save(entity: Rule): Promise<Rule | undefined> {
        return await this.executeSaveOrUpdate(entity, async (rule) => {
            const ruleCreated = await save('rule', {
                    name: rule.name,
                    createdAt: rule.createdAt
            })
            if (!ruleCreated)
                return undefined
            
            return this.mapToEntity(ruleCreated)
        })
    }
    
    async update(entity: Rule): Promise<Rule | undefined> {
        return await this.executeSaveOrUpdate(entity, async (rule) => {
            const data: any = {
                name: rule.name
            }
            
            if (rule.updatedAt)
                data['updatedAt'] = rule.updatedAt
            
            const ruleAltered = await update('rule', rule.id, data)
            if (!ruleAltered)
                return undefined
            
            return this.mapToEntity(ruleAltered)
        })
    }
    
    async delete(entity: Rule): Promise<boolean> {
        return await this.executeDelete(entity, async (id) => {
            const ruleDeleted = await remove('rule', id)
            return !!ruleDeleted
        })
    }

    async getByName(name: string, idToIgnore?: number): Promise<Rule | undefined> {
        const where: any = {
            name: {
                equals: name,
                mode: 'insensitive'
            }
        }

        if (idToIgnore)
            where['id'] = { not: idToIgnore }
        
        const rule = await getOne('rule', where)
        
        if (!rule)
            return undefined

        return this.mapToEntity(rule)
    }

    async get(id: number): Promise<Rule | undefined> {
        const rule = await getOne('rule', {
            id
        })
        
        if (!rule)
            return undefined

        return this.mapToEntity(rule)
    }

    async getMany(query: Query): Promise<Rule[]> {
        const rules = await getMany('rule', query)
        return rules.map(rule => this.mapToEntity(rule))
    }
    
    protected mapToEntity(data: any): Rule {
        return new Rule(
            data.name,
            data.id,
            data.createdAt,
            data.updatedAt
        )
    }
}

import type IRuleRepository from "../domain/models/interfaces/rules/rules-repository.interface.js"
import Rule from "../domain/models/rule.model.js"
import type { Query } from "../domain/shared/query.js"
import { mapToPrismaQuery } from "./mappers/query-builder.mapper.js"
import BaseRepository from "./shared/base-repository.js"

export default class RuleRepository extends BaseRepository<Rule> implements IRuleRepository {
    async save(entity: Rule): Promise<Rule | undefined> {
        return await this.executeSaveOrUpdate(entity, async (rule) => {
            const ruleCreated = await this._prisma.rule.create({
                data: {
                    name: rule.name,
                    createdAt: rule.createdAt
                },
            })
            if (!ruleCreated)
                return undefined
            
            return this.mapToRule(ruleCreated)
        })
    }
    
    async update(entity: Rule): Promise<Rule | undefined> {
        return await this.executeSaveOrUpdate(entity, async (rule) => {
            const data: any = {
                name: rule.name
            }
            
            if (rule.updatedAt)
                data['updatedAt'] = rule.updatedAt
            
            const ruleAltered = await this._prisma.rule.update({
                where: {
                    id: rule.id
                },
                data: data
            })
            if (!ruleAltered)
                return undefined
            
            return this.mapToRule(ruleAltered)
        })
    }
    
    async delete(entity: Rule): Promise<boolean> {
        return await this.executeDelete(entity, async (id) => {
            const ruleDeleted = await this._prisma.rule.delete({
                where: {
                    id: id
                }
            })
            
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
        
        const rule = await this._prisma.rule.findFirst({
            where: where
        })
        
        if (!rule)
            return undefined

        return this.mapToRule(rule)
    }

    async get(id: number): Promise<Rule | undefined> {
        const rule = await this._prisma.rule.findFirst({
            where: {
                id: id
            }
        })
        
        if (!rule)
            return undefined

        return this.mapToRule(rule)
    }

    async getMany(query: Query): Promise<Rule[]> {
        const rules = await this._prisma.rule.findMany(
            mapToPrismaQuery(query)
        )

        return rules.map(rule => this.mapToRule(rule))
    }
    
    private mapToRule(data: any): Rule {
        return new Rule(
            data.name,
            data.id,
            data.createdAt,
            data.updatedAt
        )
    }
}

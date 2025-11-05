import Rule from "../domain/models/rule.model.js"
import type { Query } from "../domain/shared/query.js"
import { PrismaClient } from "../generated/prisma/client.js"
import { mapToPrismaQuery } from "./mappers/query-builder.mapper.js"

const prisma = new PrismaClient()

async function saveRule(rule: Rule): Promise<Rule | undefined> {
    const ruleCreated = await prisma.rule.create({
        data: {
            name: rule.name(),
            createdAt: rule.createdAt()
        },
    })
    if (!ruleCreated)
        return undefined

    return mapToRule(ruleCreated)
}

async function alterRule(rule: Rule): Promise<Rule | undefined> {
    const data: any = {
        name: rule.name()
    }

    if (rule.updatedAt())
        data['updatedAt'] = rule.updatedAt()

    const ruleAltered = await prisma.rule.update({
        where: {
            id: rule.id()
        },
        data: data
    })
    if (!ruleAltered)
        return undefined

    return mapToRule(ruleAltered)
}

async function deleteRule(id: number): Promise<boolean> {
    const ruleDeleted = await prisma.rule.delete({
        where: {
            id: id
        }
    })

    return !!ruleDeleted
}

async function getById(id: number): Promise<Rule | undefined> {
    const rule = await prisma.rule.findFirst({
        where: {
            id: id
        }
    })
    
    if (!rule)
        return undefined

    return mapToRule(rule)
}

async function getRuleByName(name: string, idToIgnore?: number): Promise<Rule | undefined> {
    const where: any = {
            name: {
                equals: name,
                mode: 'insensitive'
            }
        }

    if (idToIgnore)
        where['id'] = { not: idToIgnore }
    
    const rule = await prisma.rule.findFirst({
        where: where
    })
    
    if (!rule)
        return undefined

    return mapToRule(rule)
}

async function getRules(query: Query): Promise<Rule[]> {
    const rules = await prisma.rule.findMany(
        mapToPrismaQuery(query)
    )

    return rules.map(rule => mapToRule(rule))
}

function mapToRule(data: any): Rule {
    return new Rule(
        data.name,
        data.id,
        data.createdAt,
        data.updatedAt
    )
}

export { saveRule, alterRule, deleteRule, getById, getRuleByName, getRules }
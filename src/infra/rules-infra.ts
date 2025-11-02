import Rule from "../domain/models/rule.model.js"
import { PrismaClient } from "../generated/prisma/client.js"

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

async function getRuleByName(name: string): Promise<Rule | undefined> {
    const rule = await prisma.rule.findFirst({
        where: {
            name: {
                equals: name,
                mode: 'insensitive'
            }
        }
    })
    
    if (!rule)
        return undefined

    return mapToRule(rule)
}

function mapToRule(data: any): Rule {
    return new Rule(
        data.name,
        data.id,
        data.createdAt
    )
}

export { saveRule, getRuleByName }
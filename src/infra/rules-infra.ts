import Rule from "../domain/models/rule.model.js"
import { PrismaClient } from "../generated/prisma/client.js"

const prisma = new PrismaClient()

async function saveRule(rule: Rule): Promise<Rule> {
    const ruleCreated = await prisma.rule.create({
        data: {
            name: rule.name(),
            createdAt: rule.createdAt()
        },
    })

    return new Rule(
        ruleCreated.name,
        ruleCreated.id,
        ruleCreated.createdAt
    )
}

export { saveRule }
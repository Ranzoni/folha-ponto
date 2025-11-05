import { ConditionOperator } from "../../domain/enums/condition-operator.enum.js"
import { OrderType } from "../../domain/enums/order-type.enum.js"
import type { Query } from "../../domain/shared/query.js"

export function mapToPrismaQuery(queryBuilder: Query): any {
    const query: any = {
        skip: (queryBuilder.page - 1) * queryBuilder.quantity,
        take: queryBuilder.quantity
    }

    let where: any = {}
    Object.keys(queryBuilder.queries).forEach(key => {
        const op = queryBuilder.queries[key]
        if (!op)
            return

        let condition
        switch (op.operator) {
            case ConditionOperator.EQUALS:
                condition = {
                    equals: op.value
                }
                break
            case ConditionOperator.NOT_EQUALS:
                condition = {
                    not: op.value
                }
                break
            case ConditionOperator.GREATER_THAN:
                condition = {
                    gt: op.value
                }
                break
            case ConditionOperator.GREATER_THAN_OR_EQUAL:
                condition = {
                    gte: op.value
                }   
                break
            case ConditionOperator.LESS_THAN:
                condition = {
                    lt: op.value
                }
                break
            case ConditionOperator.LESS_THAN_OR_EQUAL:
                condition = {
                    lte: op.value
                }
                break
            case ConditionOperator.CONTAINS:
                condition = {
                    contains: op.value,
                    mode: 'insensitive'
                }
                break
        }

        where[key] = condition
    })
    
    query['where'] = where

    Object.keys(queryBuilder.order).forEach(key => {
        const order: any = {}
        order[key] = queryBuilder.order[key] === OrderType.ASC ? 'asc' : 'desc'
        query['orderBy'] = order
    })

    return query
}
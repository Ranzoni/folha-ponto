import { ConditionOperator } from "../../domain/enums/condition-operator.enum.js"
import type { FilterRequest, FilterRequestItem, OrderRequestItem } from "../models/filter.request.js"
import { OrderType } from "../../domain/enums/order-type.enum.js"

export default function mapToFilterRequest(query: any): FilterRequest {
    const filterRequest: FilterRequest = {
        conditions: [],
        page: query.$page ? Number(query.$page) : undefined,
        quantity: query.$top ? Number(query.$top) : undefined
    }

    if (query.$filter)
        filterRequest.conditions = mapToFilter(query.$filter)

    if (query.$orderby)
        filterRequest.order = mapToOrderBy(query.$orderby)

    return filterRequest
}

function mapToFilter(queryFilter: string): FilterRequestItem[] {
    const conditions: FilterRequestItem[] = []
    
    const filters = queryFilter.split(/\s+and|or\s+/i)
    for (const filter of filters) {
        const condition = mapToCondition(filter.trim())
        if (condition)
            conditions.push(condition)
    }
    
    return conditions
}

function mapToCondition(conditionString: string): FilterRequestItem | undefined {
    const operatorMap: Record<string, ConditionOperator> = {
        'eq': ConditionOperator.EQUALS,
        'ne': ConditionOperator.NOT_EQUALS,
        'gt': ConditionOperator.GREATER_THAN,
        'ge': ConditionOperator.GREATER_THAN_OR_EQUAL,
        'lt': ConditionOperator.LESS_THAN,
        'le': ConditionOperator.LESS_THAN_OR_EQUAL,
        'contains': ConditionOperator.CONTAINS,
    }

    const regex = /(\w+)\s+(eq|ne|gt|ge|lt|le|contains)\s+(.+)/i
    const match = conditionString.match(regex)
    
    if (!match)
        throw new Error('Invalid filter query.')
    
    const [, field, operator, rawValue] = match
    if (!match || !field || !operator)
        throw new Error('Invalid filter query.')
    
    let value: any = rawValue?.trim().replace(/^['"]|['"]$/g, '')
    
    if (!isNaN(Number(value)))
        value = Number(value)
    else if (value.match(/^\d{4}-\d{2}-\d{2}/))
        value = new Date(value)
    
    const filterRequestItem: FilterRequestItem = {
        field,
        operator: operatorMap[operator.toLowerCase()]!,
        value
    }
    return filterRequestItem
}

function mapToOrderBy(orderByString: string): OrderRequestItem | undefined {
    const orderBySplited = orderByString?.split(',') ?? []
    if (!orderBySplited)
        return undefined

    const parts = orderBySplited[0]?.trim().split(/\s+/)
    if (!parts || !parts[0])
        return undefined
    
    const orderRequestItem: OrderRequestItem = {
        field: parts[0],
        orderType: parts[1]?.toLowerCase() === 'desc' ? OrderType.DESC : OrderType.ASC
    }
    return orderRequestItem
}
import { ConditionOperator } from "../enums/condition-operator.enum.js"
import type { OrderType } from "../enums/order-type.enum.js"

class Query {
    private _page: number
    private _quantity: number
    private _queries: Record<string, OperatorValue> = {}
    private _order: Record<string, OrderType> = {}

    constructor(page: number, quantity: number) {
        this._page = page
        this._quantity = quantity
    }

    get page(): number {
        return this._page
    }

    get quantity(): number {
        return this._quantity
    }

    get queries(): Record<string, OperatorValue> {
        return this._queries
    }

    get order(): Record<string, OrderType> {
        return this._order
    }

    addCondition(field: string, operator: ConditionOperator, value: any): void {
        if (!field || !Object.values(ConditionOperator).includes(operator) || !value === undefined)
            return
        
        const condition: OperatorValue = {
            operator: operator,
            value: value
        }

        this._queries[field] = condition as OperatorValue
    }

    addOrder(field: string, type: OrderType) {
        if (!field || !type === undefined)
            return

        this._order[field] = type
    }
}

interface OperatorValue {
    operator: ConditionOperator
    value: any
}

export { Query, type OperatorValue }
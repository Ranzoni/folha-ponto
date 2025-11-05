import 'dotenv/config'
import type { ConditionOperator } from '../enums/condition-operator.enum.js'
import type { OrderType } from '../enums/order-type.enum.js'
import { Query } from './query.js'

export default class Filter {
    private _page: number = 1
    private _quantity: number = Number(process.env.DEFAULT_QUANTITY_FILTER) || 10
    private _query: Query

    constructor(page?: number, quantity?: number) {
        if (page)
            this._page = page
        
        if (quantity)
            this._quantity = quantity

        this._query = new Query(this._page, this._quantity)
    }
    
    get query(): Query {
        return this._query
    }

    addFilter<T>(prop: keyof T, operator: ConditionOperator, value: any): void {
        this._query.addCondition(prop as string, operator, value)
    }

    addOrder<T>(prop: keyof T, type: OrderType): void {
        this._query.addOrder(prop as string, type)
    }
}
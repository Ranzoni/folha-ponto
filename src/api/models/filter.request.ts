import type { ConditionOperator } from "../../domain/enums/condition-operator.enum.js"
import type { OrderType } from "../../domain/enums/order-type.enum.js"

interface FilterRequest {
    conditions: FilterRequestItem[]
    order?: OrderRequestItem | undefined
    page?: number | undefined
    quantity?: number | undefined
}

interface FilterRequestItem {
    field: string
    operator: ConditionOperator
    value: any
}

interface OrderRequestItem {
    field: string
    orderType: OrderType
}

export type { FilterRequest, FilterRequestItem, OrderRequestItem }
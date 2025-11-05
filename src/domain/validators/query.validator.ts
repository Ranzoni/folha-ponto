import { ConditionOperator } from "../enums/condition-operator.enum.js"
import type { OperatorValue } from "../shared/query.js"

const STRING_OPERATIONS: ConditionOperator[] = [
    ConditionOperator.EQUALS,
    ConditionOperator.NOT_EQUALS,
    ConditionOperator.CONTAINS
]

const DATE_OPERATIONS: ConditionOperator[] = [
    ConditionOperator.GREATER_THAN,
    ConditionOperator.GREATER_THAN_OR_EQUAL,
    ConditionOperator.LESS_THAN,
    ConditionOperator.LESS_THAN_OR_EQUAL
]

const NUMBER_OPERATIONS: ConditionOperator[] = [
    ConditionOperator.EQUALS,
    ConditionOperator.NOT_EQUALS,
    ConditionOperator.GREATER_THAN,
    ConditionOperator.GREATER_THAN_OR_EQUAL,
    ConditionOperator.LESS_THAN,
    ConditionOperator.LESS_THAN_OR_EQUAL
]

function operationValueIsValidForType(operatorValue: OperatorValue): boolean {
    if (operatorValue.value instanceof Date)
        return DATE_OPERATIONS.includes(operatorValue.operator)
    else if (!isNaN(Number(operatorValue.value)))
        return NUMBER_OPERATIONS.includes(operatorValue.operator)
    else
        return STRING_OPERATIONS.includes(operatorValue.operator)
}

export { operationValueIsValidForType }

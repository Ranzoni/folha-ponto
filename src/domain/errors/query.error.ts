import DomainError from "./domain.error.js"

export default class QueryError extends DomainError {
    static invalidValueType(): void {
        throw new QueryError('The value type is incompatible with the chosen operation.')
    }
}
import DomainError from "./domain.error.js"

export default class QueryError extends DomainError {
    static invalidValueType(): void {
        throw new QueryError('O valor da condição da query escolhido é incompatível com o seu operador.')
    }
}
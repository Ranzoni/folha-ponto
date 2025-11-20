import DomainError from "./domain.error.js"

export default class LogEventError extends DomainError {
    static invalidContent(): void {
        throw new LogEventError('O conteúdo do log informado está vazio.')
    }
}
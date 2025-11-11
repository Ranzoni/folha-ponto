import DomainError from "./domain.error.js"

export default class LogEventError extends DomainError {
    static invalidContent(): void {
        throw new LogEventError('The content informed is empty.')
    }
}
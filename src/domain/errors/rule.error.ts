import DomainError from "./domain.error.js"

export default class RuleError extends DomainError {
    static invalidName(): void {
        throw new RuleError('The name must be between 3 and 50 characters long.')
    }

    static alreadyExists(): void {
        throw new RuleError('Already exists a rule with this name.')
    }

    static notFound(): void {
        throw new RuleError('Rule not found.')
    }
}
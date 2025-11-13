import DomainError from "./domain.error.js"

export default class RoleError extends DomainError {
    static invalidName(): void {
        throw new RoleError('The name must be between 3 and 50 characters long.')
    }

    static alreadyExists(): void {
        throw new RoleError('Already exists a role with this name.')
    }

    static notFound(): void {
        throw new RoleError('Role not found.')
    }
}
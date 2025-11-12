import DomainError from "./domain.error.js"

export default class DepartmentError extends DomainError {
    static invalidName(): void {
        throw new DepartmentError('The name must be between 2 and 100 characters long.')
    }

    static alreadyExists(): void {
        throw new DepartmentError('Already exists a department with this name.')
    }

    static notFound(): void {
        throw new DepartmentError('Department not found.')
    }
}
import DomainError from "./domain.error.js"

export default class EmployeeError extends DomainError { 
    static invalidName(): void {
        throw new EmployeeError('The name must be between 3 and 100 characters long.')
    }

    static workScheduleNotInformed(): void {
        throw new EmployeeError('The work schedule must be informed.')
    }

    static departmentNotInformed(): void {
        throw new EmployeeError('The department must be informed.')
    }

    static roleNotInformed(): void {
        throw new EmployeeError('The role must be informed.')
    }

    static alreadyExists(): void {
        throw new EmployeeError('Already exists a employee with this name.')
    }

    static notFound(): void {
        throw new EmployeeError('Employee not found.')
    }
}
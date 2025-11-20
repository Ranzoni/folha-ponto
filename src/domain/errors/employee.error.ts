import DomainError from "./domain.error.js"

export default class EmployeeError extends DomainError { 
    static invalidName(): void {
        throw new EmployeeError('O nome deve conter entre 3 e 100 caracteres.')
    }

    static workScheduleNotInformed(): void {
        throw new EmployeeError('A escala de trabalho não foi informada.')
    }

    static departmentNotInformed(): void {
        throw new EmployeeError('O departamento não foi informado.')
    }

    static roleNotInformed(): void {
        throw new EmployeeError('O cargo não foi informado.')
    }

    static notFound(): void {
        throw new EmployeeError('O funcionário não foi encontrado.')
    }

    static idsNotFound(ids: number[]): void {
        throw new EmployeeError(`Os seguintes ID's de funcionário não foram encontrados: ${ids}.`)
    }
}
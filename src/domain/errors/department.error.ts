import DomainError from "./domain.error.js"

export default class DepartmentError extends DomainError {
    static invalidName(): void {
        throw new DepartmentError('O nome deve conter entre 2 e 100 caracteres.')
    }

    static alreadyExists(): void {
        throw new DepartmentError('Já existe um departamento cadastrado com este nome.')
    }

    static notFound(): void {
        throw new DepartmentError('O departamento não foi encontrado.')
    }
}
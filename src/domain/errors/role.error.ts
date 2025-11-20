import DomainError from "./domain.error.js"

export default class RoleError extends DomainError {
    static invalidName(): void {
        throw new RoleError('O nome deve conter entre 3 e 50 caracteres.')
    }

    static alreadyExists(): void {
        throw new RoleError('Já existe um cargo cadastrado com este nome.')
    }

    static notFound(): void {
        throw new RoleError('O cargo não foi encontrado.')
    }

    static idsNotFound(ids: number[]): void {
        throw new RoleError(`Os seguintes ID's de cargos não foram encontrados: ${ids}.`)
    }
}
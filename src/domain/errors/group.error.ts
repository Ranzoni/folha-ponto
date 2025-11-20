import DomainError from "./domain.error.js"

export default class GroupError extends DomainError {
    static invalidName(): void {
        throw new GroupError('O nome do grupo deve conter entre 3 e 50 caracteres.')
    }

    static membersEmpty(): void {
        throw new GroupError('Os membros do grupo não foram informados.')
    }

    static employeeAndRoleEmpty(): void {
        throw new GroupError('É necessário informar o funcionário ou o cargo do membro do grupo.')
    }

    static alreadyExists(): void {
        throw new GroupError('Já existe um grupo cadastrado com este nome.')
    }

    static notFound(): void {
        throw new GroupError('O grupo não foi encontrado.')
    }
}
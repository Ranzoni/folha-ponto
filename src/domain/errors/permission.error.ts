import DomainError from "./domain.error.js"

export default class PermissionError extends DomainError {
    static itemsEmpty(): void {
        throw new PermissionError('Os itens da permissão precisam ser informados.')
    }

    static entityNotInformed(): void {
        throw new PermissionError('É necessário informar ao menos um funcionário, um departamento ou um grupo de funcionários para as permissões.')
    }

    static manyEntitiesInformed(): void {
        throw new PermissionError('Há mais de uma entidade informada para a permissão.')
    }

    static emptyPermissionItem(): void {
        throw new PermissionError('Todos os itens da permissão precisam ser preenchidos com o tipo de entidade e o tipo de permissão.')
    }
}
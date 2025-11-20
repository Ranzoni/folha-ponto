export default class PermissionError extends Error {
    static itemsEmpty(): void {
        throw new PermissionError('Os itens da permissão precisam ser informados.')
    }

    static entityNotInformed(): void {
        throw new PermissionError('É necessário informar ao menos um funcionário, um departamento ou um grupo de funcionários para as permissões.')
    }
}
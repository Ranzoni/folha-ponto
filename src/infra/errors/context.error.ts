export default class ContextError extends Error {
    static transactionNotFound(): void {
        throw new ContextError('Nenhuma transação foi encontrada.')
    }

    static entityTypeNotFound(): void {
        throw new ContextError('O tipo de entidade informado não foi encontrado.')
    }

    static operationNotAllowed(): void {
        throw new ContextError('Este tipo de entidade não tem acesso a este tipo de operação.')
    }

    static entityWasNotSaved(): void {
        throw new ContextError('A entidade não pôde ser salva. O retorno foi nulo.')
    }
}
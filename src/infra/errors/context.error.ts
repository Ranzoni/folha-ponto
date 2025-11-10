export default class ContextError extends Error {
    static transactionNotFound(): void {
        throw new ContextError('None transaction was found.')
    }

    static entityTypeNotFound(): void {
        throw new ContextError('The entity type informed was not found.')
    }

    static operationNotAllowed(): void {
        throw new ContextError('This entity type not have access to this operation.')
    }

    static entityWasNotSaved(): void {
        throw new ContextError('The entity can not be saved. The response was null.')
    }
}
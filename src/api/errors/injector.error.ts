export default class InjectorError extends Error {
    static serviceNotFound(): void {
        throw new InjectorError('The chosen service was not found.')
    }

    static ruleRepoNotFound(): void {
        throw new InjectorError('Rule repository not found.')
    }

    static transactionNotFound(): void {
        throw new InjectorError('The transaction was not found.')
    }
}
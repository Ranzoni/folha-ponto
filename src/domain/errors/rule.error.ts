export default class RuleError extends Error {
    static invalidName(): void {
        throw new RuleError('The name must be between 3 and 50 characters long.')
    }
}
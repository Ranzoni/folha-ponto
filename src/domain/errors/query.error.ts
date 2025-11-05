export default class QueryError extends Error {
    static invalidValueType(): void {
        throw new QueryError('The value type is incompatible with the chosen operation.')
    }
}
export default class LogEventError extends Error {
    static invalidContent(): void {
        throw new LogEventError('The content informed is empty.')
    }
}
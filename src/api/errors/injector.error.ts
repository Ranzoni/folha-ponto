export default class InjectorError extends Error {
    static serviceNotFound(): void {
        throw new InjectorError('The chosen service was not found.')
    }

    static roleRepoNotFound(): void {
        throw new InjectorError('Role repository not found.')
    }

    static departmentRepoNotFound(): void {
        throw new InjectorError('Department repository not found.')
    }

    static employeeRepoNotFound(): void {
        throw new InjectorError('Employee repository not found.')
    }
}
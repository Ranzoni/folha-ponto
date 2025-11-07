export default interface IRepository<T> {
    save(entity: T): Promise<T | undefined>
    update(entity: T): Promise<T | undefined>
    delete(entity: T): Promise<boolean>
}
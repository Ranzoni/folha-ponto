import type { Query } from "../query.js"

export default interface IRepositoryRead<T> {
    get(id: number): Promise<T | undefined>
    getMany(query: Query): Promise<T[]>
}
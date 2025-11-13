import type Role from "../role.model.js"
import type IRepositoryRead from "./repository-read.interface.js"
import type IRepository from "./repository.interface.js"

export default interface IRoleRepository extends IRepository<Role>, IRepositoryRead<Role> {
    getByName(name: string, idToIgnore?: number): Promise<Role | undefined>
}
import type Role from "../models/role.model.js"
import type IRepositoryRead from "../shared/interfaces/repository-read.interface.js"
import type IRepository from "../shared/interfaces/repository.interface.js"

export default interface IRoleRepository extends IRepository<Role>, IRepositoryRead<Role> {
    getByName(name: string, idToIgnore?: number): Promise<Role | undefined>
}
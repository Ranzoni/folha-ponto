import type { Group } from "../models/group.model.js"
import type IRepositoryRead from "../shared/interfaces/repository-read.interface.js"
import type IRepository from "../shared/interfaces/repository.interface.js"

export default interface IGroupRepository extends IRepository<Group>, IRepositoryRead<Group> {
    getByName(name: string, idToIgnore?: number): Promise<Group | undefined>
}
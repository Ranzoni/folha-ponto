import type { Permission } from "../models/permission.model.js"
import type IRepositoryRead from "../shared/interfaces/repository-read.interface.js"
import type IRepository from "../shared/interfaces/repository.interface.js"

export default interface IPermissionRepository extends IRepository<Permission>, IRepositoryRead<Permission> { }
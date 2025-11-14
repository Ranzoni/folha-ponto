import type Department from "../models/department.model.js"
import type IRepositoryRead from "../shared/interfaces/repository-read.interface.js"
import type IRepository from "../shared/interfaces/repository.interface.js"

export default interface IDepartmentRepository extends IRepository<Department>, IRepositoryRead<Department> {
    getByName(name: string, idToIgnore?: number): Promise<Department | undefined>
}
import type Department from "../department.model.js"
import type IRepositoryRead from "./repository-read.interface.js"
import type IRepository from "./repository.interface.js"

export default interface IDepartmentRepository extends IRepository<Department>, IRepositoryRead<Department> { }
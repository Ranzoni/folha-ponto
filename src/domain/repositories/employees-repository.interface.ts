import type Employee from "../models/employee.model.js";
import type IRepositoryRead from "../shared/interfaces/repository-read.interface.js";
import type IRepository from "../shared/interfaces/repository.interface.js"
import type { Query } from "../shared/query.js";

export default interface IEmployeeRepository extends IRepository<Employee>, IRepositoryRead<Employee> {
    getIncludingDeactivated(id: number): Promise<Employee | undefined>
    getManyIncludingDeactivated(query: Query): Promise<Employee[]>
}
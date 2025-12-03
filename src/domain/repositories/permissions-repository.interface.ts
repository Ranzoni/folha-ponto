import type { Permission } from "../models/permission.model.js"
import type IRepositoryRead from "../shared/interfaces/repository-read.interface.js"
import type IRepository from "../shared/interfaces/repository.interface.js"

export default interface IPermissionRepository extends IRepository<Permission>, IRepositoryRead<Permission> {
    getByEmployeeId(employeeId: number): Promise<Permission | undefined>
    getByRoleId(roleId: number): Promise<Permission | undefined>
    getByDepartmentId(departmentId: number): Promise<Permission | undefined>
    getByGroupId(groupId: number): Promise<Permission | undefined>
}
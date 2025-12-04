import { openTransaction, type TransactionCallBack } from "../infra/context-infra.js"
import DepartmentRepository from "../infra/departments-infra.js"
import EmployeeRepository from "../infra/employees-infra.js"
import GroupRepository from "../infra/group-infra.js"
import PermissionRepository from "../infra/permissions-infra.js"
import RoleRepository from "../infra/roles-infra.js"
import DepartmentService from "../services/department-service.js"
import EmployeeService from "../services/employee-service.js"
import GroupService from "../services/group-service.js"
import PermissionService from "../services/permission-service.js"
import RoleService from "../services/role-service.js"
import InjectorError from "./errors/injector.error.js"

type ServicesType = 'role' | 'department' | 'employee' | 'group' | 'permission'

type ServiceMap = {
    'role': RoleService
    'department': DepartmentService
    'employee': EmployeeService
    'group': GroupService
    'permission': PermissionService
}

function getService<T extends ServicesType>(type: ServicesType): ServiceMap[T] {
    switch (type) {
        case 'role':
            return new RoleService(getRoleRepository()) as ServiceMap[T]
        case 'department':
            return new DepartmentService(getDepartmentRepository()) as ServiceMap[T]
        case 'employee':
            return new EmployeeService(
                getEmployeeRepository(),
                getDepartmentRepository(),
                getRoleRepository()
            ) as ServiceMap[T]
        case 'group':
            return new GroupService(
                getGroupRepository(),
                getEmployeeRepository(),
                getRoleRepository()
            ) as ServiceMap[T]
        case 'permission':
            return new PermissionService(
                getPermissionRepository(),
                getEmployeeRepository(),
                getRoleRepository(),
                getDepartmentRepository(),
                getGroupRepository()
            ) as ServiceMap[T]
        default:
            throw InjectorError.serviceNotFound()
    }
}

function getRoleRepository(): RoleRepository {
    const roleRepository = new RoleRepository()
    if (!roleRepository)
        InjectorError.roleRepoNotFound()

    return roleRepository
}

function getDepartmentRepository(): DepartmentRepository {
    const departmentRepository = new DepartmentRepository()
    if (!departmentRepository)
        InjectorError.departmentRepoNotFound()

    return departmentRepository
}

function getEmployeeRepository(): EmployeeRepository {
    const departmentRepository = new EmployeeRepository()
    if (!departmentRepository)
        InjectorError.departmentRepoNotFound()

    return departmentRepository
}

function getGroupRepository(): GroupRepository {
    const groupRepository = new GroupRepository()
    if (!groupRepository)
        InjectorError.groupRepoNotFound()

    return groupRepository
}

function getPermissionRepository(): PermissionRepository {
    const permissionRepository = new PermissionRepository()
    if (!permissionRepository)
        InjectorError.permissionRepoNotFound()

    return permissionRepository
}

async function transaction<TResponse>(callBack: TransactionCallBack<TResponse | undefined>): Promise<TResponse | undefined> {
    return await openTransaction(callBack)
}

export { getService, transaction }
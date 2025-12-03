import type { PermissionRequest, PermissionResponse } from "../api/models/permission.request.js"
import DepartmentError from "../domain/errors/department.error.js"
import EmployeeError from "../domain/errors/employee.error.js"
import GroupError from "../domain/errors/group.error.js"
import PermissionError from "../domain/errors/permission.error.js"
import RoleError from "../domain/errors/role.error.js"
import type Department from "../domain/models/department.model.js"
import type Employee from "../domain/models/employee.model.js"
import type { Group } from "../domain/models/group.model.js"
import { Permission, type PermissionItem } from "../domain/models/permission.model.js"
import type Role from "../domain/models/role.model.js"
import type IDepartmentRepository from "../domain/repositories/departments-repository.interface.js"
import type IEmployeeRepository from "../domain/repositories/employees-repository.interface.js"
import type IGroupRepository from "../domain/repositories/group-repository.interface.js"
import type IPermissionRepository from "../domain/repositories/permissions-repository.interface.js"
import type IRoleRepository from "../domain/repositories/roles-repository.interface.js"
import mapToPermissionResponse from "./mappers/permission.mapper.js"

export default class PermissionService {
    private _permissionRepository: IPermissionRepository
    private _employeeRepository: IEmployeeRepository
    private _roleRepository: IRoleRepository
    private _departmentRepository: IDepartmentRepository
    private _groupRepository: IGroupRepository

    constructor(
        permissionRepository: IPermissionRepository,
        employeeRepository: IEmployeeRepository,
        roleRepository: IRoleRepository,
        departmentRepository: IDepartmentRepository,
        groupRepository: IGroupRepository
    ) {
        this._permissionRepository = permissionRepository
        this._employeeRepository = employeeRepository
        this._roleRepository = roleRepository
        this._departmentRepository = departmentRepository
        this._groupRepository = groupRepository
    }

    async includePermissions(request: PermissionRequest): Promise<PermissionResponse[]> {
        const permissionItems = request.permissions.map(p => {
            return {
                id: 0,
                entity: p.entity,
                type: p.type
            } as PermissionItem
        })

        const permissionsIncluded: PermissionResponse[] = []

        const employeePermissions = await this.includeEmployeePermissions(permissionItems, request.employeeId)
        if (employeePermissions)
            permissionsIncluded.push(employeePermissions)

        const rolePermissions = await this.includeRolePermissions(permissionItems, request.roleId)
        if (rolePermissions)
            permissionsIncluded.push(rolePermissions)

        const departmentPermissions = await this.includeDepartmentPermissions(permissionItems, request.departmentId)
        if (departmentPermissions)
            permissionsIncluded.push(departmentPermissions)

        const groupPermissions = await this.includeGroupPermissions(permissionItems, request.groupId)
        if (groupPermissions)
            permissionsIncluded.push(groupPermissions)

        return permissionsIncluded
    }

    private async includeEmployeePermissions(permissionItems: PermissionItem[], employeeId?: number): Promise<PermissionResponse | undefined> {
        if (!employeeId)
            return undefined

        const employee = await this._employeeRepository.get(employeeId)
        if (!employee)
            EmployeeError.notFound()

        const permission = await this._permissionRepository.getByEmployeeId(employeeId)
        return await this.saveOrUpdatePermission(permissionItems, permission, employee)
    }

    private async includeRolePermissions(permissionItems: PermissionItem[], roleId?: number): Promise<PermissionResponse | undefined> {
        if (!roleId)
            return undefined

        const role = await this._roleRepository.get(roleId)
        if (!role)
            RoleError.notFound()

        const permission = await this._permissionRepository.getByRoleId(roleId)
        return await this.saveOrUpdatePermission(permissionItems, permission, undefined, role)
    }

    private async includeDepartmentPermissions(permissionItems: PermissionItem[], departmentId?: number): Promise<PermissionResponse | undefined> {
        if (!departmentId)
            return undefined

        const department = await this._departmentRepository.get(departmentId)
        if (!department)
            DepartmentError.notFound()

        const permission = await this._permissionRepository.getByDepartmentId(departmentId)
        return await this.saveOrUpdatePermission(permissionItems, permission, undefined, undefined, department)
    }

    private async includeGroupPermissions(permissionItems: PermissionItem[], groupId?: number): Promise<PermissionResponse | undefined> {
        if (!groupId)
            return undefined

        const group = await this._groupRepository.get(groupId)
        if (!group)
            GroupError.notFound()

        const permission = await this._permissionRepository.getByGroupId(groupId)
        return await this.saveOrUpdatePermission(permissionItems, permission, undefined, undefined, undefined, group)
    }

    private async saveOrUpdatePermission(permissionItems: PermissionItem[], permission?: Permission, employee?: Employee, role?: Role, department?: Department, group?: Group): Promise<PermissionResponse> {
        let permissionIncluded: Permission

        if (permission)
            permissionIncluded = await this.updatePermission(permission, permissionItems)
        else
            permissionIncluded = await this.createPermission(permissionItems, employee, role, department, group)

        return mapToPermissionResponse(permissionIncluded)
    }

    private async createPermission(items: PermissionItem[], employee?: Employee, role?: Role, department?: Department, group?: Group): Promise<Permission> {
        const permission = new Permission(items, employee, role, department, group)
        const permissionCreated = await this._permissionRepository.save(permission)
        if (!permissionCreated)
            throw new PermissionError('Falha ao recuperar a permissão criada.')

        return permissionCreated!
    }

    private async updatePermission(permission: Permission, items: PermissionItem[]): Promise<Permission> {
        permission.updatePermissions(items)
        const permissionUpdated = await this._permissionRepository.update(permission)
        if (!permissionUpdated)
            throw new PermissionError('Falha ao recuperar a permissão alterada.')

        return permissionUpdated!
    }
}
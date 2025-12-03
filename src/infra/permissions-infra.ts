import type Department from "../domain/models/department.model.js"
import type Employee from "../domain/models/employee.model.js"
import type { Group } from "../domain/models/group.model.js"
import { Permission, type PermissionItem } from "../domain/models/permission.model.js"
import type Role from "../domain/models/role.model.js"
import type IPermissionRepository from "../domain/repositories/permissions-repository.interface.js"
import type { Query } from "../domain/shared/query.js"
import { save, update, remove, getOne, getMany } from "./context-infra.js"
import mapAnyToDepartment from "./mappers/department.mapper.js"
import mapAnyToEmployee from "./mappers/employee.mapper.js"
import mapAnyToGroup from "./mappers/group.mapper.js"
import mapAnyToRole from "./mappers/role.mapper.js"
import BaseRepository from "./shared/base-repository.js"

export default class PermissionRepository extends BaseRepository<Permission> implements IPermissionRepository {
    getByEmployeeId(employeeId: number): Promise<Permission | undefined> {
        throw new Error("Method not implemented.")
    }
    
    getByRoleId(roleId: number): Promise<Permission | undefined> {
        throw new Error("Method not implemented.")
    }

    getByDepartmentId(departmentId: number): Promise<Permission | undefined> {
        throw new Error("Method not implemented.")
    }
    
    getByGroupId(groupId: number): Promise<Permission | undefined> {
        throw new Error("Method not implemented.")
    }

    async save(entity: Permission): Promise<Permission | undefined> {
        return await this.executeSaveOrUpdate(entity, async (permission) => {
            const permissionCreated = await save('permission', {
                permissions: permission.permissions,
                employee: permission.employee,
                role: permission.role,
                department: permission.department,
                employeeGroup: permission.group,
                createdAt: permission.createdAt
            })
            if (!permissionCreated)
                return undefined
            
            return this.mapToEntity(permissionCreated)
        })
    }

    async update(entity: Permission): Promise<Permission | undefined> {
        return await this.executeSaveOrUpdate(entity, async (permission) => {
            const data: any = {
                permissions: permission.permissions,
                employee: permission.employee,
                role: permission.role,
                department: permission.department,
                employeeGroup: permission.group,
            }
            
            if (permission.updatedAt)
                data['updatedAt'] = permission.updatedAt

            const permissionAltered = await update('permission', entity.id, data)
            if (!permissionAltered)
                return undefined

            return this.mapToEntity(permissionAltered)
        })
    }

    async delete(entity: Permission): Promise<boolean> {
        return await this.executeDelete(entity, async (id) => {
            const permissionDeleted = await remove('permission', id)
            return !!permissionDeleted
        })
    }

    async get(id: number): Promise<Permission | undefined> {
        const permission = await getOne('permission', {
            id
        })
        
        if (!permission)
            return undefined

        return this.mapToEntity(permission)
    }

    async getMany(query: Query): Promise<Permission[]> {
        const permissions = await getMany('permission', query)
        return permissions.map(permission => this.mapToEntity(permission))
    }

    protected mapToEntity(data: any): Permission {
        const permissions = data.permissions.map((permission: any) => {
            return {
                id: permission.id,
                entity: permission.entity,
                type: permission.type
            } as PermissionItem
        })

        let employee: Employee | undefined
        if (data.employee)
            employee = mapAnyToEmployee(data.employee)

        let role: Role | undefined
        if (data.role)
            role = mapAnyToRole(data.role)

        let department: Department | undefined
        if (data.department)
            department = mapAnyToDepartment(data.department)

        let group: Group | undefined
        if (data.group)
            group =  mapAnyToGroup(data.group)

        return new Permission(
            permissions,
            employee,
            role,
            department,
            group,
            data.id,
            data.createdAt,
            data.updatedAt
        )
    }
}
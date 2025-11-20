import type Department from "../domain/models/department.model.js"
import type { Group } from "../domain/models/group.model.js"
import { Permission, type PermissionItem } from "../domain/models/permission.model.js"
import type Role from "../domain/models/role.model.js"
import type IPermissionRepository from "../domain/repositories/permissions-repository.interface.js"
import type { Query } from "../domain/shared/query.js"
import { save, update, remove, getOne, getMany } from "./context-infra.js"
import mapAnyToDepartment from "./mappers/department.mapper.js"
import mapAnyToGroup from "./mappers/group.mapper.js"
import mapAnyToRole from "./mappers/role.mapper.js"
import BaseRepository from "./shared/base-repository.js"

export default class PermissionRepository extends BaseRepository<Permission> implements IPermissionRepository {
    async save(entity: Permission): Promise<Permission | undefined> {
        return await this.executeSaveOrUpdate(entity, async (permission) => {
            const permissionCreated = await save('permission', {
                permissions: permission.permissions,
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
                role: permission.role,
                department: permission.department,
                employeeGroup: permission.group,
            }
            
            if (permission.updatedAt)
                data['updatedAt'] = permission.updatedAt

            const departmentAltered = await update('department', entity.id, data)
            if (!departmentAltered)
                return undefined

            return this.mapToEntity(departmentAltered)
        })
    }

    async delete(entity: Permission): Promise<boolean> {
        return await this.executeDelete(entity, async (id) => {
            const departmentDeleted = await remove('department', id)
            return !!departmentDeleted
        })
    }

    async get(id: number): Promise<Permission | undefined> {
        const department = await getOne('department', {
            id
        })
        
        if (!department)
            return undefined

        return this.mapToEntity(department)
    }

    async getMany(query: Query): Promise<Permission[]> {
        const departments = await getMany('department', query)
        return departments.map(department => this.mapToEntity(department))
    }

    protected mapToEntity(data: any): Permission {
        const permissions = data.permissions.map((permission: any) => {
            return {
                id: permission.id,
                entity: permission.entity,
                type: permission.type
            } as PermissionItem
        })

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
            role,
            department,
            group,
            data.id,
            data.createdAt,
            data.updatedAt
        )
    }
}
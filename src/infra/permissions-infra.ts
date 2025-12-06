import { Permission, type PermissionItem } from "../domain/models/permission.model.js"
import type IPermissionRepository from "../domain/repositories/permissions-repository.interface.js"
import type { Query } from "../domain/shared/query.js"
import { save, update, remove, getOne, getMany } from "./context-infra.js"
import BaseRepository from "./shared/base-repository.js"

export default class PermissionRepository extends BaseRepository<Permission> implements IPermissionRepository {
    async getByEmployeeId(employeeId: number): Promise<Permission | undefined> {
        const permission = await getOne('permission', {
            employeeId
        })
        
        if (!permission)
            return undefined

        return this.mapToEntity(permission)
    }
    
    async getByRoleId(roleId: number): Promise<Permission | undefined> {
        const permission = await getOne('permission', {
            roleId
        })
        
        if (!permission)
            return undefined

        return this.mapToEntity(permission)
    }

    async getByDepartmentId(departmentId: number): Promise<Permission | undefined> {
        const permission = await getOne('permission', {
            departmentId
        })
        
        if (!permission)
            return undefined

        return this.mapToEntity(permission)
    }
    
    async getByGroupId(groupId: number): Promise<Permission | undefined> {
        const permission = await getOne('permission', {
            groupId
        })
        
        if (!permission)
            return undefined

        return this.mapToEntity(permission)
    }

    async save(entity: Permission): Promise<Permission | undefined> {
        return await this.executeSaveOrUpdate(entity, async (permission) => {
            const data: any = {
                permissions: {
                    create: permission.permissions.map(p => ({
                        entity: p.entity,
                        type: p.type
                    }))
                },
                createdAt: permission.createdAt
            }

            if (permission.employeeId) {
                data.employee = {
                    connect: { id: permission.employeeId }
                }
            }

            if (permission.roleId) {
                data.role = {
                    connect: { id: permission.roleId }
                }
            }

            if (permission.departmentId) {
                data.department = {
                    connect: { id: permission.departmentId }
                }
            }

            if (permission.groupId) {
                data.group = {
                    connect: { id: permission.groupId }
                }
            }

            const permissionCreated = await save('permission', data)
            if (!permissionCreated)
                return undefined
            
            return this.mapToEntity(permissionCreated)
        })
    }

    async update(entity: Permission): Promise<Permission | undefined> {
        return await this.executeSaveOrUpdate(entity, async (permission) => {
            const data: any = {
                permissions: permission.permissions,
                employee: permission.employeeId,
                role: permission.roleId,
                department: permission.departmentId,
                employeeGroup: permission.groupId,
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

        let employeeId: number | undefined
        if (data.employeeId)
            employeeId = data.employeeId

        let roleId: number | undefined
        if (data.roleId)
            roleId = data.roleId

        let departmentId: number | undefined
        if (data.departmentId)
            departmentId = data.departmentId

        let groupId: number | undefined
        if (data.groupId)
            groupId = data.groupId

        return new Permission(
            permissions,
            employeeId,
            roleId,
            departmentId,
            groupId,
            data.id,
            data.createdAt,
            data.updatedAt
        )
    }
}
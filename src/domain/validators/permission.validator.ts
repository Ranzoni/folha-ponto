import { isPermissionEntity } from "../enums/permission-entity.enum.js"
import { isPermissionType } from "../enums/permission-type.enum.js"
import type { Permission, PermissionItem } from "../models/permission.model.js"

function hasPermission(permissions: PermissionItem[]): boolean {
    return permissions && permissions.length > 0
}

function hasEntityInformed(permission: Permission): boolean {
    return !!permission.employeeId || !!permission.roleId || !!permission.departmentId || !!permission.groupId
}

function onlyOneEntityInformed(permission: Permission): boolean {
    if (permission.employeeId)
        if (permission.roleId || permission.departmentId || permission.groupId)
            return false

    if (permission.roleId)
        if (permission.departmentId || permission.groupId)
            return false

    if (permission.departmentId && permission.groupId)
            return false

    return true
}

function allItemsAreValid(permission: Permission): boolean {
    return permission.permissions.every(p => p && isPermissionType(p.type) && isPermissionEntity(p.entity))
}

export { hasPermission, hasEntityInformed, onlyOneEntityInformed, allItemsAreValid }
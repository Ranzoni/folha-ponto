import type { Permission, PermissionItem } from "../models/permission.model.js"

function hasPermission(permissions: PermissionItem[]): boolean {
    return permissions && permissions.length > 0
}

function hasEntityInformed(permission: Permission): boolean {
    return !!permission.role || !!permission.department || !!permission.group
}

export { hasPermission, hasEntityInformed }
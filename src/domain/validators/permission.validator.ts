import type { Permission, PermissionItem } from "../models/permission.model.js"

function hasPermission(permissions: PermissionItem[]): boolean {
    return permissions && permissions.length > 0
}

function hasEntityInformed(permission: Permission): boolean {
    return !!permission.employee || !!permission.role || !!permission.department || !!permission.group
}

function onlyOneEntityInformed(permission: Permission): boolean {
    if (permission.employee)
        if (permission.role || permission.department || permission.group)
            return false

    if (permission.role)
        if (permission.department || permission.group)
            return false

    if (permission.department && permission.group)
            return false

    return true
}

export { hasPermission, hasEntityInformed, onlyOneEntityInformed }
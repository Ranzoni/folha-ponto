import type { PermissionEntity } from "../../../domain/enums/permission-entity.enum.js"
import type { PermissionType } from "../../../domain/enums/permission-type.enum.js"

interface PermissionRequest {
    permissions: PermissionItemRequest[]
    employeeId?: number
    roleId?: number
    departmentId?: number
    groupId?: number
}

interface PermissionItemRequest {
    entity: PermissionEntity
    type: PermissionType
}

export type { PermissionRequest, PermissionItemRequest }
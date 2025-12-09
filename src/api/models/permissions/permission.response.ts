import type { PermissionEntity } from "../../../domain/enums/permission-entity.enum.js"
import type { PermissionType } from "../../../domain/enums/permission-type.enum.js"

interface PermissionResponse {
    permissions: PermissionItemResponse[]
    employeeId?: number
    roleId?: number
    departmentId?: number
    groupId?: number
}

interface PermissionItemResponse {
    entity: PermissionEntity
    type: PermissionType
}

export type { PermissionResponse, PermissionItemResponse }
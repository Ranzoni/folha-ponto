import type { PermissionItemResponse, PermissionResponse } from "../../api/models/permissions/permission.response.js"
import type { Permission } from "../../domain/models/permission.model.js"

export default function mapToPermissionResponse(permission: Permission): PermissionResponse {
    return {
        permissions: permission.permissions.map(p => { return { entity: p.entity, type: p.type } as PermissionItemResponse }),
        employeeId: permission.employeeId,
        roleId: permission.roleId,
        departmentId: permission.departmentId,
        groupId: permission.groupId
    } as PermissionResponse
}
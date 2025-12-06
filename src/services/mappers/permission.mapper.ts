import type { PermissionResponse } from "../../api/models/permissions/permission.response.js"
import type { Permission } from "../../domain/models/permission.model.js"

export default function mapToPermissionResponse(permission: Permission): PermissionResponse {
    return {
        id: permission.id,
        permissions: permission.permissions,
        employeeId: permission.employeeId,
        roleId: permission.roleId,
        departmentId: permission.departmentId,
        groupId: permission.groupId
    } as PermissionResponse
}
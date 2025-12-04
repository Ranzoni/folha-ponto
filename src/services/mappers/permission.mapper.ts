import type { PermissionResponse } from "../../api/models/permissions/permission.response.js"
import type { Permission } from "../../domain/models/permission.model.js"
import mapToDepartmentResponse from "./department.mapper.js"
import mapToEmployeeResponse from "./employee.mapper.js"
import mapToGroupResponse from "./group.mapper.js"
import mapToRoleResponse from "./role.mapper.js"

export default function mapToPermissionResponse(permission: Permission): PermissionResponse {
    return {
        id: permission.id,
        permissions: permission.permissions,
        employee: permission.employee ? mapToEmployeeResponse(permission.employee) : undefined,
        role: permission.role ? mapToRoleResponse(permission.role) : undefined,
        department: permission.department ? mapToDepartmentResponse(permission.department) : undefined,
        group: permission.group ? mapToGroupResponse(permission.group) : undefined
    } as PermissionResponse
}
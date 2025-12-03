import type { PermissionEntity } from "../../domain/enums/permission-entity.enum.js"
import type { PermissionType } from "../../domain/enums/permission-type.enum.js"
import type BaseResponse from "./base.response.js"
import type DepartmentResponse from "./department.response.js"
import type { EmployeeResponse } from "./employee.response.js"
import type { GroupResponse } from "./group.response.js"
import type { RoleResponse } from "./role.response.js"

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

interface PermissionResponse extends BaseResponse {
    permissions: PermissionItemResponse[]
    employee?: EmployeeResponse
    role?: RoleResponse
    department?: DepartmentResponse
    group?: GroupResponse
}

interface PermissionItemResponse extends BaseResponse {
    entity: PermissionEntity
    type: PermissionType
}

export type { PermissionRequest, PermissionItemRequest, PermissionResponse }
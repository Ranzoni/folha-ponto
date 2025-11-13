import type Role from "../../domain/models/role.model.js"
import type { RoleResponse as RoleResponse } from "../../api/models/role.response.js"

export default function mapToRoleResponse(role: Role): RoleResponse {
    return {
        id: role.id,
        name: role.name
    } as RoleResponse 
}
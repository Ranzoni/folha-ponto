import type { GroupResponse } from "../../api/models/group.response.js"
import type { Group } from "../../domain/models/group.model.js"
import mapToEmployeeResponse from "./employee.mapper.js"
import mapToRoleResponse from "./role.mapper.js"

export default function mapToGroupResponse(group: Group, simplify: boolean = false): GroupResponse {
    const employeesMembers = group.members.filter(m => !!m.employee).map(m => m.employee!)
    const rolesMembers = group.members.filter(m => !!m.role).map(m => m.role!)

    return {
        id: group.id,
        name: group.name,
        employees: simplify ? undefined : employeesMembers.map(m => mapToEmployeeResponse(m)),
        roles: simplify ? undefined : rolesMembers.map(r => mapToRoleResponse(r))
    } as GroupResponse
}

import type Employee from "../../domain/models/employee.model.js"
import { Group, type IGroupMember } from "../../domain/models/group.model.js"
import type Role from "../../domain/models/role.model.js"
import mapAnyToEmployee from "./employee.mapper.js"
import mapAnyToRole from "./role.mapper.js"

export default function mapAnyToGroup(data: any): Group {
    const members = data.groupMembers.map((member: any) => {
        let employee: Employee | undefined
        if (member.employee)
            employee = mapAnyToEmployee(member.employee)

        let role: Role | undefined
        if (member.role)
            role = mapAnyToRole(member.role)

        return {
            id: member.id,
            employee,
            role
        } as IGroupMember
    })

    return new Group(
        data.name,
        members,
        [],
        [],
        data.id,
        data.createdAt,
        data.updatedAt
    )
}
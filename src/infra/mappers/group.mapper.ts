import type Employee from "../../domain/models/employee.model.js"
import { Group, type IGroupMember } from "../../domain/models/group.model.js"
import type Role from "../../domain/models/role.model.js"
import mapAnyToEmployee from "./employee.mapper.js"
import mapAnyToRole from "./role.mapper.js"

export default function mapAnyToGroup(data: any): Group {
    const members = data.members.map((member: any) => {
        let employee: Employee | undefined
        if (data.employee)
            employee = mapAnyToEmployee(data.employee)

        let role: Role | undefined
        if (data.role)
            role = mapAnyToRole(data.role)

        return {
            id: member.id,
            employee: member.employee,
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
import GroupError from "../errors/group.error.js"
import { BaseModel } from "./base.model.js"
import type Employee from "./employee.model.js"
import type Role from "./role.model.js"
import { removeArrayItems } from "../shared/utils-functions.js"
import { groupMemberNotEmpty, hasGroupMembers, groupNameIsValid } from "../validators/group.validator.js"

class Group extends BaseModel {
    private _name: string
    private _members: GroupMember [] = []
    
    constructor(
        name: string,
        members: GroupMember[],
        employees: Employee[] = [],
        roles: Role[] = [],
        id?: number,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        super(id, createdAt, updatedAt)
        
        this._name = name

        this._members = members
        this.addEmployees(employees)
        this.addRoles(roles)
        
        this.validate()
    }

    get name(): string {
        return this._name
    }

    get members(): IGroupMember[] {
        return this._members
    }

    update(name: string): void {
        this._name = name
        this.registerUpdate()
    }

    addEmployees(employees: Employee[]): void {
        if (employees.length === 0)
            return

        let hasUpdate = false
        employees.every(employee => {
            if (this._members.find(m => m.employee && m.employee.id === employee.id))
                return

            const member = this.createMember(employee)
            this._members.push(member)
            hasUpdate = true
        })

        if (hasUpdate)
            this.registerUpdate()
    }

    removeEmployees(employeesIds: number[]): void {
        if (employeesIds.length === 0)
            return

        const membersIds = this._members.filter(member => {
            if (!member.employee)
                return

            employeesIds.findIndex(id => id === member.employee!.id)
        }) ?? []

        removeArrayItems(this._members, membersIds.map(m => m.id))
        this.registerUpdate()
    }

    addRoles(roles: Role[]): void {
        if (roles.length === 0)
            return

        let hasUpdate = false
        roles.every(role => {
            if (this._members.find(m => m.role && m.role.id === role.id))
                return

            const member = this.createMember(undefined, role)
            this._members.push(member)
            hasUpdate = true
        })

        if (hasUpdate)
            this.registerUpdate()
    }

    removeRoles(rolesIds: number[]): void {
        if (rolesIds.length === 0)
            return

        const membersIds = this._members.filter(member => {
            if (!member.role)
                return

            rolesIds.findIndex(id => id === member.role!.id)
        }) ?? []

        removeArrayItems(this._members, membersIds.map(m => m.id))
        this.registerUpdate()
    }

    protected validate(): void {
        if (!groupNameIsValid(this._name))
            GroupError.invalidName()

        if (!hasGroupMembers(this._members))
            GroupError.membersEmpty()

        this._members.find(member => {
            if (!groupMemberNotEmpty(member))
                GroupError.employeeAndRoleEmpty()
        })
    }

    private createMember(employee?: Employee, role?: Role): GroupMember {
        return new GroupMember(employee, role)
    }
}

class GroupMember implements IGroupMember {
    private _id: number = 0
    private _employee?: Employee
    private _role?: Role

    constructor(employee?: Employee, role?: Role, id?: number) {
        if (employee)        
            this._employee = employee
        
        if (role)        
            this._role = role

        if (id)        
            this._id = id
    }

    get id(): number {
        return this._id
    }

    get employee(): Employee | undefined {
        return this._employee
    }

    get role(): Role | undefined {
        return this._role
    }
}

interface IGroupMember {
    get id(): number
    get employee(): Employee | undefined,
    get role(): Role | undefined,
}

export { Group, type IGroupMember }
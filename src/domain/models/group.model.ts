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

    updateEmployees(employees: Employee[]): void {
        const employeesToRemove = this._members.filter(member => {
            return member.employee && !employees.find(employee => employee.id == member.employee!.id)
        })

        const employeesRemoved = this.removeEmployees(employeesToRemove.map(employee => employee.id))
        const employeesIncluded = this.addEmployees(employees)

        if (employeesRemoved || employeesIncluded)
            this.registerUpdate()
    }

    updateRoles(roles: Role[]): void {
        const rolesToRemove = this._members.filter(member => {
            return member.role && !roles.find(role => role.id == member.role!.id)
        })

        const rolesRemoved = this.removeRoles(rolesToRemove.map(role => role.id))
        const rolesIncluded = this.addRoles(roles)

        if (rolesRemoved || rolesIncluded)
            this.registerUpdate()
    }

    private addEmployees(employees: Employee[]): boolean {
        if (employees.length === 0)
            return false

        let hasUpdate = false
        employees.forEach(employee => {
            if (this._members.find(m => m.employee && m.employee.id === employee.id))
                return

            const member = this.createMember(employee)
            this._members.push(member)
            hasUpdate = true
        })

        return hasUpdate
    }

    private removeEmployees(employeesIds: number[]): boolean {
        if (employeesIds.length === 0)
            return false

        const membersIds = this._members.filter(member => {
            if (!member.employee)
                return

            return employeesIds.findIndex(id => id === member.employee!.id)
        }) ?? []

        removeArrayItems(this._members, membersIds.map(m => m.id))
        return membersIds.length > 0
    }

    private addRoles(roles: Role[]): boolean {
        if (roles.length === 0)
            return false

        let hasUpdate = false
        roles.forEach(role => {
            if (this._members.find(m => m.role && m.role.id === role.id))
                return

            const member = this.createMember(undefined, role)
            this._members.push(member)
            hasUpdate = true
        })

        return hasUpdate
    }

    private removeRoles(rolesIds: number[]): boolean {
        if (rolesIds.length === 0)
            return false

        const membersIds = this._members.filter(member => {
            if (!member.role)
                return

            return rolesIds.findIndex(id => id === member.role!.id)
        }) ?? []

        removeArrayItems(this._members, membersIds.map(m => m.id))
        return membersIds.length > 0
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
import type { PermissionEntity } from "../enums/permission-entity.enum.js"
import type { PermissionType } from "../enums/permission-type.enum.js"
import PermissionError from "../errors/permission.error.js"
import { BaseModel } from "./base.model.js"
import Department from "./department.model.js"
import { removeArrayItems } from "../shared/utils-functions.js"
import { hasEntityInformed, hasPermission, onlyOneEntityInformed } from "../validators/permission.validator.js"
import type Role from "./role.model.js"
import { Group } from "./group.model.js"
import type Employee from "./employee.model.js"

class Permission extends BaseModel {
    private _permissions: PermissionItem[] = []
    private _employee?: Employee
    private _role?: Role
    private _department?: Department
    private _group?: Group

    constructor(
        permissions: PermissionItem[],
        employee?: Employee,
        role?: Role,
        department?: Department,
        group?: Group,
        id?: number,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        super(id, createdAt, updatedAt)
        
        this._permissions = permissions

        if (employee)
            this._employee = employee

        if (role)
            this._role

        if (department)
            this._department = department

        if (group)
            this._group = group

        this.validate()
    }

    get employee(): Employee | undefined {
        return this._employee
    }

    get role(): Role | undefined {
        return this._role
    }

    get department(): Department | undefined {
        return this._department
    }

    get group(): Group | undefined {
        return this._group
    }

    get permissions(): PermissionItem[] {
        return this._permissions
    }

    updatePermissions(permissions: PermissionItem[]): void {
        const permissionsRemoved = this.removePermissions(permissions.map(p => p.id))
        const permissionsIncluded = this.addPermissions(permissions)

        if (permissionsRemoved || permissionsIncluded)
            this.registerUpdate()
    }

    protected validate(): void {
        if (!hasPermission(this._permissions))
            PermissionError.itemsEmpty()

        if (!hasEntityInformed(this))
            PermissionError.entityNotInformed()

        if (!onlyOneEntityInformed(this))
            PermissionError.manyEntitiesInformed()
    }

    private addPermissions(permissions: PermissionItem[]): boolean {
        if (permissions.length === 0)
            return false

        let hasUpdate = false
        permissions.forEach(permission => {
            if (this._permissions.find(p => p.id === permission.id))
                return

            this._permissions.push(permission)
            hasUpdate = true
        })

        return hasUpdate
    }
    
    private removePermissions(permissionsIds: number[]): boolean {
        if (permissionsIds.length === 0)
            return false

        const ids = this._permissions.filter(permission => permissionsIds.findIndex(id => id === permission.id)) ?? []

        removeArrayItems(this._permissions, ids.map(m => m.id))
        return ids.length > 0
    }
}

interface PermissionItem {
    id: number
    entity: PermissionEntity
    type: PermissionType
}

export { Permission, type PermissionItem }

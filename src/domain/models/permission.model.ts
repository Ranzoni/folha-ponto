import type { PermissionEntity } from "../enums/permission-entity.enum.js"
import type { PermissionType } from "../enums/permission-type.enum.js"
import PermissionError from "../errors/permission.error.js"
import { BaseModel } from "./base.model.js"
import Department from "./department.model.js"
import { removeArrayItems } from "../shared/utils-functions.js"
import { hasEntityInformed, hasPermission } from "../validators/permission.validator.js"
import type Role from "./role.model.js"
import { Group } from "./group.model.js"

class Permission extends BaseModel {
    private _permissions: PermissionItem[] = []
    private _role?: Role
    private _department?: Department
    private _group?: Group

    constructor(
        permissions: PermissionItem[],
        role?: Role,
        department?: Department,
        group?: Group,
        id?: number,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        super(id, createdAt, updatedAt)
        
        this._permissions = permissions

        if (role)
            this._role

        if (department)
            this._department = department

        if (group)
            this._group = group

        this.validate()
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

    addPermissions(permissions: PermissionItem[]): void {
        if (permissions.length === 0)
            return
        
        permissions.every(permission => this._permissions.push(permission))
        this.registerUpdate()
    }

    removePermissions(permissionsIds: number[]): void {
        if (permissionsIds.length === 0)
            return
        
        removeArrayItems(this._permissions, permissionsIds)
        this.registerUpdate()
    }

    protected validate(): void {
        if (!hasPermission(this._permissions))
            PermissionError.itemsEmpty()

        if (!hasEntityInformed(this))
            PermissionError.entityNotInformed()
    }
}

interface PermissionItem {
    id: number
    entity: PermissionEntity
    type: PermissionType
}

export { Permission, type PermissionItem }

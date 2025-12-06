import type { PermissionEntity } from "../enums/permission-entity.enum.js"
import type { PermissionType } from "../enums/permission-type.enum.js"
import PermissionError from "../errors/permission.error.js"
import { BaseModel } from "./base.model.js"
import { removeArrayItems } from "../shared/utils-functions.js"
import { allItemsAreValid, hasEntityInformed, hasPermission, onlyOneEntityInformed } from "../validators/permission.validator.js"

class Permission extends BaseModel {
    private _permissions: PermissionItem[] = []
    private _employeeId?: number
    private _roleId?: number
    private _departmentId?: number
    private _groupId?: number

    constructor(
        permissions: PermissionItem[],
        employeeId?: number,
        roleId?: number,
        departmentId?: number,
        groupId?: number,
        id?: number,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        super(id, createdAt, updatedAt)
        
        this._permissions = permissions

        if (employeeId)
            this._employeeId = employeeId

        if (roleId)
            this._roleId = roleId

        if (departmentId)
            this._departmentId = departmentId

        if (groupId)
            this._groupId = groupId

        this.validate()
    }

    get employeeId(): number | undefined {
        return this._employeeId
    }

    get roleId(): number | undefined {
        return this._roleId
    }

    get departmentId(): number | undefined {
        return this._departmentId
    }

    get groupId(): number | undefined {
        return this._groupId
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

        if (!allItemsAreValid(this))
            PermissionError.emptyPermissionItem()
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

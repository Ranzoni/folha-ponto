import { BaseModel } from "../models/base.model.js"
import type { IGroupMember } from "../models/group.model.js"
import type { PermissionItem } from "../models/permission.model.js"

function isNumberPrimitive(value: any): value is number {
  return typeof value === "number"
}

function removeArrayItems<T extends BaseModel | PermissionItem | IGroupMember>(array: T[], ids: number[]) {
    ids.forEach(idToRemove => {
        const indexToRemove = array.findIndex(emp => emp.id === idToRemove)
        if (indexToRemove >= 0)
            array.splice(indexToRemove, 1)
    })
}

export { isNumberPrimitive, removeArrayItems }
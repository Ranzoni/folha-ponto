import type { IGroupMember } from "../models/group.model.js"

function groupNameIsValid(name: string): boolean {
    return !!name.trim() && name.trim().length >= 3 && name.length <= 50
}

function hasGroupMembers(members: IGroupMember[]): boolean {
    return !!members && members.length > 0
}

function groupMemberNotEmpty(member: IGroupMember): boolean {
    return !!member.employee || !!member.role
}

export { groupNameIsValid, hasGroupMembers, groupMemberNotEmpty }
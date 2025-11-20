import type { Group } from "../domain/models/group.model.js"
import type IGroupRepository from "../domain/repositories/group-repository.interface.js"
import type { Query } from "../domain/shared/query.js"
import { getMany, getOne, remove, save } from "./context-infra.js"
import mapAnyToGroup from "./mappers/group.mapper.js"
import BaseRepository from "./shared/base-repository.js"

export default class GroupRepository extends BaseRepository<Group> implements IGroupRepository {
    async save(entity: Group): Promise<Group | undefined> {
        return await this.executeSaveOrUpdate(entity, async (group) => {
            const membersData = group.members.map(memberData => {
                return {
                    employee: memberData.employee,
                    role: memberData.role,
                }
            })

            const data = {
                name: group.name,
                groupMembers: membersData,
                createdAt: group.createdAt
            }

            const groupCreated = await save('group', data)
            if (!groupCreated)
                return undefined

            return this.mapToEntity(groupCreated)
        })
    }

    async update(entity: Group): Promise<Group | undefined> {
        return await this.executeSaveOrUpdate(entity, async (group) => {
            const membersData = group.members.map(memberData => {
                if (memberData.id)
                    return
                
                return {
                    employee: memberData.employee,
                    role: memberData.role,
                }
            })

            const data = {
                name: group.name,
                membersData,
                updatedAt: group.updatedAt
            }

            const groupCreated = await save('group', data)
            if (!groupCreated)
                return undefined

            return this.mapToEntity(groupCreated)
        })
    }

    async delete(entity: Group): Promise<boolean> {
        return await this.executeDelete(entity, async (id) => {
            const groupDeleted = await remove('group', id)
            return !!groupDeleted
        })
    }

    async get(id: number): Promise<Group | undefined> {
        const group = await getOne('group', {
            id
        })

        if (!group)
            return undefined

        return this.mapToEntity(group)
    }

    async getMany(query: Query): Promise<Group[]> {
        const groups = await getMany('group', query)
        return groups.map(group => this.mapToEntity(group))
    }

    async getByName(name: string, idToIgnore?: number): Promise<Group | undefined> {
        const where: any = {
            name: {
                equals: name,
                mode: 'insensitive'
            }
        }

        if (idToIgnore)
            where['id'] = { not: idToIgnore }
        
        const group = await getOne('group', where)
        
        if (!group)
            return undefined

        return this.mapToEntity(group)
    }
    
    protected mapToEntity(data: any): Group {
        return mapAnyToGroup(data)
    }
}
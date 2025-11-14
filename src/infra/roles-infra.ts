import type IRoleRepository from "../domain/repositories/roles-repository.interface.js"
import Role from "../domain/models/role.model.js"
import type { Query } from "../domain/shared/query.js"
import BaseRepository from "./shared/base-repository.js"
import { getMany, getOne, remove, save, update } from "./context-infra.js"
import mapAnyToRole from "./mappers/role.mapper.js"

export default class RoleRepository extends BaseRepository<Role> implements IRoleRepository {
    async save(entity: Role): Promise<Role | undefined> {
        return await this.executeSaveOrUpdate(entity, async (role) => {
            const roleCreated = await save('role', {
                    name: role.name,
                    createdAt: role.createdAt
            })
            if (!roleCreated)
                return undefined
            
            return this.mapToEntity(roleCreated)
        })
    }
    
    async update(entity: Role): Promise<Role | undefined> {
        return await this.executeSaveOrUpdate(entity, async (role) => {
            const data: any = {
                name: role.name
            }
            
            if (role.updatedAt)
                data['updatedAt'] = role.updatedAt
            
            const roleAltered = await update('role', role.id, data)
            if (!roleAltered)
                return undefined
            
            return this.mapToEntity(roleAltered)
        })
    }
    
    async delete(entity: Role): Promise<boolean> {
        return await this.executeDelete(entity, async (id) => {
            const roleDeleted = await remove('role', id)
            return !!roleDeleted
        })
    }

    async getByName(name: string, idToIgnore?: number): Promise<Role | undefined> {
        const where: any = {
            name: {
                equals: name,
                mode: 'insensitive'
            }
        }

        if (idToIgnore)
            where['id'] = { not: idToIgnore }
        
        const role = await getOne('role', where)
        
        if (!role)
            return undefined

        return this.mapToEntity(role)
    }

    async get(id: number): Promise<Role | undefined> {
        const role = await getOne('role', {
            id
        })
        
        if (!role)
            return undefined

        return this.mapToEntity(role)
    }

    async getMany(query: Query): Promise<Role[]> {
        const roles = await getMany('role', query)
        return roles.map(role => this.mapToEntity(role))
    }
    
    protected mapToEntity(data: any): Role {
        return mapAnyToRole(data)
    }
}

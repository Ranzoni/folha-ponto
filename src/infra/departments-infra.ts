import Department from "../domain/models/department.model.js"
import type IDepartmentRepository from "../domain/models/interfaces/departments-repository.interface.js"
import type { Query } from "../domain/shared/query.js"
import { getMany, getOne, remove, save, update } from "./context-infra.js"
import BaseRepository from "./shared/base-repository.js"

export default class DepartmentRepository extends BaseRepository<Department> implements IDepartmentRepository {
    async getByName(name: string, idToIgnore?: number): Promise<Department | undefined> {
        const where: any = {
            name
        }

        if (idToIgnore)
            where['id'] = idToIgnore

        const department = await getOne('department', where)
        if (!department)
            return undefined

        return this.mapToEntity(department)
    }

    async save(entity: Department): Promise<Department | undefined> {
        return await this.executeSaveOrUpdate(entity, async (department) => {
            const departmentCreated = await save('department', {
                    name: department.name,
                    createdAt: department.createdAt
            })
            if (!departmentCreated)
                return undefined
            
            return this.mapToEntity(departmentCreated)
        })
    }

    async update(entity: Department): Promise<Department | undefined> {
        return await this.executeSaveOrUpdate(entity, async (department) => {
            const data: any = {
                name: department.name
            }
            
            if (department.updatedAt)
                data['updatedAt'] = department.updatedAt

            const departmentAltered = await update('department', entity.id, data)
            if (!departmentAltered)
                return undefined

            return this.mapToEntity(departmentAltered)
        })
    }

    async delete(entity: Department): Promise<boolean> {
        return await this.executeDelete(entity, async (id) => {
            const departmentDeleted = await remove('department', id)
            return !!departmentDeleted
        })
    }

    async get(id: number): Promise<Department | undefined> {
        const department = await getOne('department', {
            id
        })
        
        if (!department)
            return undefined

        return this.mapToEntity(department)
    }

    async getMany(query: Query): Promise<Department[]> {
        const departments = await getMany('department', query)
        return departments.map(department => this.mapToEntity(department))
    }

    protected mapToEntity(data: any): Department {
        return new Department(
            data.name,
            data.id,
            data.createdAt,
            data.updatedAt
        )
    }
}
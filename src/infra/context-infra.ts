import type { Query } from "../domain/shared/query.js"
import { PrismaClient } from "../generated/prisma/client.js"
import ContextError from "./errors/context.error.js"
import { mapToPrismaQuery } from "./mappers/query-builder.mapper.js"

let transaction: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$extends'> | undefined

type EntitiesType = 'role' | 'logEvent' | 'department' | 'employee' | 'group' | 'permission'

type TransactionCallBack<T> = () => Promise<T>

async function openTransaction<TResponse>(callBack: TransactionCallBack<TResponse | undefined>): Promise<TResponse | undefined> {
    const baseClient = new PrismaClient()

    return await baseClient.$transaction(async (tx) => {
        transaction = tx
        try {
            return await callBack()
        } finally {
            transaction = undefined
        }
    }, {
        maxWait: 5000,
        timeout: 30000,
    })
}

async function saveMany<T extends EntitiesType>(entityType: T, data: any): Promise<void> {
    if (!transaction)
        ContextError.transactionNotFound()

    switch (entityType) {
        case 'logEvent':
            await transaction!.logEvent.createMany({
                data
            })
            break
        case 'permission':
            await transaction!.permission.createMany({
                data
            })
        default:
            ContextError.operationNotAllowed()
            break
    }
}

async function save<T extends EntitiesType>(entityType: T, data: any): Promise<any | undefined> {
    if (!transaction)
        ContextError.transactionNotFound()

    switch (entityType) {
        case 'role':
            return await transaction!.role.create({
                data
            })
        case 'logEvent':
            return await transaction!.logEvent.create({
                data
            })
        case 'department':
            return await transaction!.department.create({
                data
            })
        case 'employee':
            return await transaction!.employee.create({
                data,
                include: {
                    department: true,
                    role: true
                }
            })
        case 'group':
            return await transaction!.group.create({
                data,
                include: {
                    groupMembers: {
                        include: {
                            role: true,
                            employee: { 
                                include: {
                                    department: true,
                                    role: true
                                }
                            },
                            group: true
                        }
                    }
                }
            })
        default:
            ContextError.operationNotAllowed()
    }
}

async function update<T extends EntitiesType>(entityType: T, id: number, data: any): Promise<any | undefined> {
    if (!transaction)
        ContextError.transactionNotFound()

    switch (entityType) {
        case 'role':
            return await transaction!.role.update({
                where: {
                    id
                },
                data
            })
        case 'department':
            return await transaction!.department.update({
                where: {
                    id
                },
                data
            })
        case 'employee':
            return await transaction!.employee.update({
                where: {
                    id
                },
                data,
                include: {
                    department: true,
                    role: true
                }
            })
        case 'group':
            return await transaction!.group.update({
                where: {
                    id
                },
                data,
                include: {
                    groupMembers: {
                        include: {
                            role: true,
                            employee: { 
                                include: {
                                    department: true,
                                    role: true
                                }
                            },
                            group: true
                        }
                    }
                }
            })
        case 'permission':
            await transaction!.permission.update({
                where: {
                    id
                },
                data,
                include: {
                    employee: true,
                    department: true,
                    role: true,
                    group : true,
                    permissions: true
                }
            })
        default:
            ContextError.operationNotAllowed()
    }
}

async function remove<T extends EntitiesType>(entityType: T, id: number): Promise<any | undefined> {
    if (!transaction)
        ContextError.transactionNotFound()

    switch (entityType) {
        case 'role':
            return await transaction!.role.delete({
                where: {
                    id
                }
            })
        case 'department':
            return await transaction!.department.delete({
                where: {
                    id
                }
            })
        case 'employee':
            return await transaction!.employee.delete({
                where: {
                    id
                }
            })
        case 'group':
            return await transaction!.group.delete({
                where: {
                    id
                }
            })
        case 'permission':
            return await transaction!.permission.delete({
                where: {
                    id
                }
            })
        default:
            ContextError.operationNotAllowed()
    }
}

async function getOne<T extends EntitiesType>(entityType: T, where: any): Promise<any | undefined> {
    if (!transaction)
        ContextError.transactionNotFound()

    switch (entityType) {
        case 'role':
            return await transaction!.role.findFirst({
                where
            })
        case 'department':
            return await transaction!.department.findFirst({
                where
            })
        case 'employee':
            return await transaction!.employee.findFirst({
                where,
                include: {
                    department: true,
                    role: true
                }
            })
        case 'group':
            return await transaction!.group.findFirst({
                where,
                include: {
                    groupMembers: {
                        include: {
                            role: true,
                            employee: { 
                                include: {
                                    department: true,
                                    role: true
                                }
                            },
                            group: true
                        }
                    }
                }
            })
        case 'permission':
            return await transaction!.permission.findFirst({
                where,
                include: {
                    employee: true,
                    department: true,
                    role: true,
                    group : true,
                    permissions: true
                }
            })
        default:
            ContextError.operationNotAllowed()
    }
}

async function getMany<T extends EntitiesType>(entityType: T, query: Query): Promise<any[]> {
    if (!transaction)
        ContextError.transactionNotFound()

    const prismaQuery = mapToPrismaQuery(query)

    switch (entityType) {
        case 'role':
            return await transaction!.role.findMany(prismaQuery)
        case 'department':
            return await transaction!.department.findMany(prismaQuery)
        case 'employee':
            prismaQuery['include'] = {
                department: true,
                role: true
            }
            return await transaction!.employee.findMany(prismaQuery)
        case 'group':
            prismaQuery['include'] = {
                groupMembers: {
                    include: {
                        role: true,
                        employee: { 
                            include: {
                                department: true,
                                role: true
                            }
                        },
                        group: true
                    }
                }
            }
            return await transaction!.group.findMany(prismaQuery)
        case 'permission':
            prismaQuery['include'] = { 
                employee: true,
                department: true,
                role: true,
                group : true,
                permissions: true
            }
            return await transaction!.permission.findMany(prismaQuery)
        default:
            ContextError.operationNotAllowed()
    }

    return []
}

export { type EntitiesType, type TransactionCallBack, openTransaction, saveMany, save, update, remove, getOne, getMany }
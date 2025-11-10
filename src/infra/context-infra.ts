import type { Query } from "../domain/shared/query.js"
import { PrismaClient } from "../generated/prisma/client.js"
import ContextError from "./errors/context.error.js"
import { mapToPrismaQuery } from "./mappers/query-builder.mapper.js"

let transaction: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$extends'> | undefined

type EntitiesType = 'rule' | 'logEvent'

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
        default:
            ContextError.operationNotAllowed()
            break
    }
}

async function save<T extends EntitiesType>(entityType: T, data: any): Promise<any | undefined> {
    if (!transaction)
        ContextError.transactionNotFound()

    switch (entityType) {
        case 'rule':
            return await transaction!.rule.create({
                data
            })
        case 'logEvent':
            return await transaction!.logEvent.createMany({
                data
            })
        default:
            ContextError.operationNotAllowed()
    }
}

async function update<T extends EntitiesType>(entityType: T, id: number, data: any): Promise<any | undefined> {
    if (!transaction)
        ContextError.transactionNotFound()

    switch (entityType) {
        case 'rule':
            return await transaction!.rule.update({
                where: {
                    id
                },
                data: data
            })
        default:
            ContextError.operationNotAllowed()
    }
}

async function remove<T extends EntitiesType>(entityType: T, id: number): Promise<any | undefined> {
    if (!transaction)
        ContextError.transactionNotFound()

    switch (entityType) {
        case 'rule':
            return await transaction!.rule.delete({
                where: {
                    id: id
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
        case 'rule':
            return await transaction!.rule.findFirst({
                where: where
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
        case 'rule':
            return await transaction!.rule.findMany(prismaQuery)
        default:
            ContextError.operationNotAllowed()
    }

    return []
}

export { type EntitiesType, type TransactionCallBack, openTransaction, saveMany, save, update, remove, getOne, getMany }
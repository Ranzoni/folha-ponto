import type IRuleRepository from "../domain/models/interfaces/rules/rules-repository.interface.js"
import { getClient } from "../infra/context-infra.js"
import RuleRepository from "../infra/rules-infra.js"
import RuleService from "../services/rule-service.js"
import InjectorError from "./errors/injector.error.js"

type ServicesType = 'rule'

type ServiceMap = {
    'rule': RuleService
}

type RepositoryMap = {
    'rule': IRuleRepository
}

function getService<T extends ServicesType>(type: ServicesType): ServiceMap[T] {
    let service: any
    switch (type) {
        case 'rule':
            const repo = getRepository('rule')
            if (!repo)
                InjectorError.ruleRepoNotFound()

            service = new RuleService(repo)
            break
        default:
            InjectorError.serviceNotFound()
    }

    return service
}

let transactionClient: any

const repositoryMap = {
    'rule': RuleRepository
} as const

function getRepository<T extends ServicesType>(type: T): RepositoryMap[T] {
    if (!transactionClient)
        InjectorError.transactionNotFound()

    const RepoClass = repositoryMap[type]
    return new RepoClass(transactionClient) as RepositoryMap[T]
}

type TransactionCallBack<T> = () => Promise<T>

async function transaction<TResponse>(callBack: TransactionCallBack<TResponse | undefined>): Promise<TResponse | undefined> {
    const client = getClient()
    
    return await client.$transaction(async (tx) => {
        transactionClient = tx
        try {
            return await callBack()
        } finally {
            transactionClient = undefined
        }
    }, {
        maxWait: 5000,
        timeout: 30000,
    })
}

export { getService, getRepository, transaction }
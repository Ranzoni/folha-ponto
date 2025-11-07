import { Router, type Request, type Response } from "express"
import { handleFailResponse, handleSuccessResponse } from "../models/api.response.js"
import mapToFilterRequest from "../mappers/filter-request.mapper.js"
import RuleService from "../../services/rule-service.js"
import { getRepository } from "../api-injector.js"
import type IRuleRepository from "../../domain/models/interfaces/rules/rules-repository.interface.js"

const ruleRoutes = Router()
const ruleRepository = getRepository('rule') as IRuleRepository
const ruleService = new RuleService(ruleRepository)

ruleRoutes.post('/', async (req: Request, res: Response) => {
    const requestBody = req.body

    if (!requestBody || !requestBody.name)
        return res.json(handleFailResponse('Request name was not found.'))

    try {
        const ruleCreated = await ruleService.createRule(requestBody.name)
        return res.json(handleSuccessResponse(ruleCreated))
    } catch (err) {
        if (err instanceof Error)
            return res.json(handleFailResponse(err.message))
        else 
            return res.json(handleFailResponse('Not mapped error found.'))
    }
})

ruleRoutes.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    const requestBody = req.body

    if (!id || !+id)
        return res.json(handleFailResponse('Request ID was not found.'))

    if (!requestBody || !requestBody.name)
        return res.json(handleFailResponse('Request name was not found.'))

    try {
        const ruleUpdated = await ruleService.updateRule(+id, requestBody.name)
        return res.json(handleSuccessResponse(ruleUpdated))
    } catch (err) {
        if (err instanceof Error)
            return res.json(handleFailResponse(err.message))
        else 
            return res.json(handleFailResponse('Not mapped error found.'))
    }
})

ruleRoutes.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params

    if (!id || !+id)
        return res.json(handleFailResponse('Request ID was not found.'))

    try {
        await ruleService.removeRule(+id)
        return res.json(handleSuccessResponse('The rule was successfully removed.'))
    } catch (err) {
        if (err instanceof Error)
            return res.json(handleFailResponse(err.message))
        else 
            return res.json(handleFailResponse('Not mapped error found.'))
    }
})

ruleRoutes.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params

    if (!id || !+id)
        return res.json(handleFailResponse('Request ID was not found.'))

    try {
        const rule = await ruleService.searchRule(+id)
        return res.json(handleSuccessResponse(rule))
    } catch (err) {
        if (err instanceof Error)
            return res.json(handleFailResponse(err.message))
        else 
            return res.json(handleFailResponse('Not mapped error found.'))
    }
})

ruleRoutes.get('/', async (req: Request, res: Response) => {
    try {
        const filters = mapToFilterRequest(req.query)
        if (!filters)
            return res.json(handleFailResponse('Request parameters was not found.'))

        const rule = await ruleService.searchRules(filters)
        return res.json(handleSuccessResponse(rule))
    } catch (err) {
        if (err instanceof Error)
            return res.json(handleFailResponse(err.message))
        else 
            return res.json(handleFailResponse('Not mapped error found.'))
    }
})

export default ruleRoutes

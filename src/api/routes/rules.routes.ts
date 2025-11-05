import { Router, type Request, type Response } from "express"
import { handleFailResponse, handleSuccessResponse } from "../models/api.response.js"
import { createRule, removeRule, searchRule, searchRules, updateRule } from "../../services/rule-service.js"
import type { FilterRequest } from "../models/filter.request.js"
import mapToFilterRequest from "../mappers/filter-request.mapper.js"

const rulesRoutes = Router()

rulesRoutes.post('/', async (req: Request, res: Response) => {
    const requestBody = req.body

    if (!requestBody || !requestBody.name)
        return res.json(handleFailResponse('Request name was not found.'))

    try {
        const ruleCreated = await createRule(requestBody.name)
        return res.json(handleSuccessResponse(ruleCreated))
    } catch (err) {
        if (err instanceof Error)
            return res.json(handleFailResponse(err.message))
        else 
            return res.json(handleFailResponse('Not mapped error found.'))
    }
})

rulesRoutes.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    const requestBody = req.body

    if (!id || !+id)
        return res.json(handleFailResponse('Request ID was not found.'))

    if (!requestBody || !requestBody.name)
        return res.json(handleFailResponse('Request name was not found.'))

    try {
        const ruleUpdated = await updateRule(+id, requestBody.name)
        return res.json(handleSuccessResponse(ruleUpdated))
    } catch (err) {
        if (err instanceof Error)
            return res.json(handleFailResponse(err.message))
        else 
            return res.json(handleFailResponse('Not mapped error found.'))
    }
})

rulesRoutes.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params

    if (!id || !+id)
        return res.json(handleFailResponse('Request ID was not found.'))

    try {
        await removeRule(+id)
        return res.json(handleSuccessResponse('The rule was successfully removed.'))
    } catch (err) {
        if (err instanceof Error)
            return res.json(handleFailResponse(err.message))
        else 
            return res.json(handleFailResponse('Not mapped error found.'))
    }
})

rulesRoutes.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params

    if (!id || !+id)
        return res.json(handleFailResponse('Request ID was not found.'))

    try {
        const rule = await searchRule(+id)
        return res.json(handleSuccessResponse(rule))
    } catch (err) {
        if (err instanceof Error)
            return res.json(handleFailResponse(err.message))
        else 
            return res.json(handleFailResponse('Not mapped error found.'))
    }
})

rulesRoutes.get('/', async (req: Request, res: Response) => {
    try {
        const filters = mapToFilterRequest(req.query)
        if (!filters)
            return res.json(handleFailResponse('Request parameters was not found.'))

        const rule = await searchRules(filters)
        return res.json(handleSuccessResponse(rule))
    } catch (err) {
        if (err instanceof Error)
            return res.json(handleFailResponse(err.message))
        else 
            return res.json(handleFailResponse('Not mapped error found.'))
    }
})

export default rulesRoutes

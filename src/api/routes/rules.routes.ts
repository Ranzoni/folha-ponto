import { Router, type Request, type Response } from "express"
import { handleFailResponse, handleSuccessResponse } from "../models/api.response.js"
import mapToFilterRequest from "../mappers/filter-request.mapper.js"
import { getService, transaction } from "../api-injector.js"
import type { RuleResponse } from "../models/rule.response.js"

const ruleRoutes = Router()

ruleRoutes.post('/', async (req: Request, res: Response) => {
    const requestBody = req.body
    
    if (!requestBody || !requestBody.name)
        return res.json(handleFailResponse('Request name was not found.'))
    
    try {
        const ruleCreated = await transaction<RuleResponse>(async () => {
            return await getService('rule')
                .createRule(requestBody.name)
        })
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
        const ruleUpdated = await transaction<RuleResponse>(async () => {
            return await getService('rule')
                .updateRule(+id, requestBody.name)
        })
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
        await transaction<void>(async () => {
            await getService('rule')
                .removeRule(+id)
        })
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
        const rule = await transaction<RuleResponse>(async () => {
            return await getService('rule')
                .searchRule(+id)
        })
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

        const rules = await transaction<RuleResponse[]>(async () => {
            return await getService('rule')
                .searchRules(filters)
        }) ?? []
        return res.json(handleSuccessResponse(rules))
    } catch (err) {
        if (err instanceof Error)
            return res.json(handleFailResponse(err.message))
        else 
            return res.json(handleFailResponse('Not mapped error found.'))
    }
})

export default ruleRoutes

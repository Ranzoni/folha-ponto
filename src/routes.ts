import { Router, type Request, type Response } from "express"
import { mapToFailApiResponse, mapToSuccessApiResponse } from "./models/api.response.js"
import { createRule, removeRule, searchRule, updateRule } from "./services/rule-service.js"

const rulesRoutes = Router()

rulesRoutes.post('/', async (req: Request, res: Response) => {
    const requestBody = req.body

    if (!requestBody || !requestBody.name)
        return res.json(mapToFailApiResponse('Request name was not found.'))

    try {
        const ruleCreated = await createRule(requestBody.name)
        return res.json(mapToSuccessApiResponse(ruleCreated))
    } catch (err) {
        if (err instanceof Error)
            return res.json(mapToFailApiResponse(err.message))
        else 
            return res.json(mapToFailApiResponse('Not mapped error found.'))
    }
})

rulesRoutes.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    const requestBody = req.body

    if (!id || !+id)
        return res.json(mapToFailApiResponse('Request ID was not found.'))

    if (!requestBody || !requestBody.name)
        return res.json(mapToFailApiResponse('Request name was not found.'))

    try {
        const ruleUpdated = await updateRule(+id, requestBody.name)
        return res.json(mapToSuccessApiResponse(ruleUpdated))
    } catch (err) {
        if (err instanceof Error)
            return res.json(mapToFailApiResponse(err.message))
        else 
            return res.json(mapToFailApiResponse('Not mapped error found.'))
    }
})

rulesRoutes.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params

    if (!id || !+id)
        return res.json(mapToFailApiResponse('Request ID was not found.'))

    try {
        await removeRule(+id)
        return res.json(mapToSuccessApiResponse('The rule was successfully removed.'))
    } catch (err) {
        if (err instanceof Error)
            return res.json(mapToFailApiResponse(err.message))
        else 
            return res.json(mapToFailApiResponse('Not mapped error found.'))
    }
})

rulesRoutes.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params

    if (!id || !+id)
        return res.json(mapToFailApiResponse('Request ID was not found.'))

    try {
        const rule = await searchRule(+id)
        return res.json(mapToSuccessApiResponse(rule))
    } catch (err) {
        if (err instanceof Error)
            return res.json(mapToFailApiResponse(err.message))
        else 
            return res.json(mapToFailApiResponse('Not mapped error found.'))
    }
})

rulesRoutes.get('/', (req: Request, res: Response) => {
    return res.json(
        { items:
            [
                { id: 1, name: 'Programador' }
            ]
        }
    )
})

export default rulesRoutes

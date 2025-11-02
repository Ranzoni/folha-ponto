import { Router, type Request, type Response } from "express"
import { mapToFailApiResponse, mapToSuccessApiResponse } from "./models/api.response.js"
import createRule from "./services/rule-service.js"

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
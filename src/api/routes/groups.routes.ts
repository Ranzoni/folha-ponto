import { Router, type Request, type Response } from "express"
import { handleFailResponse, handleSuccessResponse, handleThrowResponse } from "../models/api.response.js"
import { getService, transaction } from "../api-injector.js"
import type { GroupRequest, GroupResponse } from "../models/group.response.js"
import type GroupService from "../../services/group-service.js"
import mapToFilterRequest from "../mappers/filter-request.mapper.js"

const groupRoutes = Router()

groupRoutes.post('/', async (req: Request, res: Response) => {
    const requestBody = req.body
    
    if (!requestBody)
        return res.status(400).json(handleFailResponse('O corpo da requisição não foi informado.'))

    if (!requestBody.name)
        return res.status(400).json(handleFailResponse('O nome do grupo não foi informado.'))

    try {
        const employeeCreated = await transaction<GroupResponse>(async () => {
            return await getGroupService().createGroup(requestBody as GroupRequest)
        })
        return res.status(201).json(handleSuccessResponse(employeeCreated))
    } catch (err) {
        return handleThrowResponse(err, res)
    }
})

groupRoutes.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    const requestBody = req.body
    
    if (!id || !+id)
        return res.status(400).json(handleFailResponse('O ID do grupo não foi informado na requisição.'))

    if (!requestBody)
        return res.status(400).json(handleFailResponse('O corpo da requisição não foi informado.'))

    if (!requestBody.name)
        return res.status(400).json(handleFailResponse('O nome do grupo não foi informado.'))

    try {
        const employeeUpdated = await transaction<GroupResponse>(async () => {
            return await getGroupService().updateGroup(+id, requestBody as GroupRequest)
        })
        return res.json(handleSuccessResponse(employeeUpdated))
    } catch (err) {
        return handleThrowResponse(err, res)
    }
})

groupRoutes.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    
    if (!id || !+id)
        return res.status(400).json(handleFailResponse('O ID do grupo não foi informado na requisição.'))

    try {
        await transaction<void>(async () => {
            return await getGroupService().removeGroup(+id)
        })
        return res.json(handleSuccessResponse('O grupo foi removido com sucesso.'))
    } catch (err) {
        return handleThrowResponse(err, res)
    }
})

groupRoutes.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params

    if (!id || !+id)
        return res.status(400).json(handleFailResponse('O ID do grupo não foi informado na requisição.'))

    try {
        const employee = await transaction<GroupResponse>(async () => {
            return await getGroupService().searchGroup(+id)
        })
        return res.json(handleSuccessResponse(employee))
    } catch (err) {
        return handleThrowResponse(err, res)
    }
})

groupRoutes.get('/', async (req: Request, res: Response) => {
    try {
        const filters = mapToFilterRequest(req.query)
        if (!filters)
            return res.status(400).json(handleFailResponse('Os parâmetros não foram informados na requisição.'))

        const employee = await transaction<GroupResponse[]>(async () => {
            return await getGroupService().searchGroups(filters)
        })
        return res.json(handleSuccessResponse(employee))
    } catch (err) {
        return handleThrowResponse(err, res)
    }
})

function getGroupService(): GroupService {
    return getService('group') as GroupService
}

export default groupRoutes
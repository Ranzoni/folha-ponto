import { Router, type Request, type Response } from "express"
import { handleFailResponse, handleSuccessResponse, handleThrowResponse } from "../models/api.response.js"
import mapToFilterRequest from "../mappers/filter-request.mapper.js"
import { getService, transaction } from "../api-injector.js"
import type { RoleResponse } from "../models/role.response.js"
import type RoleService from "../../services/role-service.js"

const roleRoutes = Router()

roleRoutes.post('/', async (req: Request, res: Response) => {
    const requestBody = req.body
    
    if (!requestBody || !requestBody.name)
        return res.status(400).json(handleFailResponse('Request name was not found.'))
    
    try {
        const roleCreated = await transaction<RoleResponse>(async () => {
            return await getRoleService()
                .createRole(requestBody.name)
        })
        return res.status(201).json(handleSuccessResponse(roleCreated))
    } catch (err) {
        return handleThrowResponse(err, res)
    }
})

roleRoutes.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    const requestBody = req.body

    if (!id || !+id)
        return res.status(400).json(handleFailResponse('Request ID was not found.'))

    if (!requestBody || !requestBody.name)
        return res.status(400).json(handleFailResponse('Request name was not found.'))

    try {
        const roleUpdated = await transaction<RoleResponse>(async () => {
            return await getRoleService()
                .updateRole(+id, requestBody.name)
        })
        return res.json(handleSuccessResponse(roleUpdated))
    } catch (err) {
        return handleThrowResponse(err, res)
    }
})

roleRoutes.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params

    if (!id || !+id)
        return res.status(400).json(handleFailResponse('Request ID was not found.'))

    try {
        await transaction<void>(async () => {
            await getRoleService()
                .removeRole(+id)
        })
        return res.json(handleSuccessResponse('The role was successfully removed.'))
    } catch (err) {
        return handleThrowResponse(err, res)
    }
})

roleRoutes.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params

    if (!id || !+id)
        return res.status(400).json(handleFailResponse('Request ID was not found.'))

    try {
        const role = await transaction<RoleResponse>(async () => {
            return await getRoleService()
                .searchRole(+id)
        })
        return res.json(handleSuccessResponse(role))
    } catch (err) {
        return handleThrowResponse(err, res)
    }
})

roleRoutes.get('/', async (req: Request, res: Response) => {
    try {
        const filters = mapToFilterRequest(req.query)
        if (!filters)
            return res.status(400).json(handleFailResponse('Request parameters was not found.'))

        const roles = await transaction<RoleResponse[]>(async () => {
            return await getRoleService()
                .searchRoles(filters)
        }) ?? []
        return res.json(handleSuccessResponse(roles))
    } catch (err) {
        return handleThrowResponse(err, res)
    }
})

function getRoleService(): RoleService {
    return getService('role') as RoleService
}

export default roleRoutes

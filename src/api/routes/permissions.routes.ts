import { Router, type Request, type Response  } from "express"
import { handleFailResponse, handleSuccessResponse, handleThrowResponse, type ApiResponse } from "../models/api.response.js"
import { getService, transaction } from "../api-injector.js"
import type { PermissionResponse } from "../models/permissions/permission.response.js"
import type PermissionService from "../../services/permission-service.js"
import type { PermissionRequest } from "../models/permissions/permission.request.js"

const permissionRoutes = Router()

permissionRoutes.put('/', async (req: Request, res: Response) => {
    const requestBody = req.body

    const validation = validatePermissionRequestBody(requestBody)
    if (validation)
        return res.status(400).json(validation)

    try {
        const permissionIncluded = await transaction<PermissionResponse[]>(async () => {
            return await getPermissionService().includePermissions(requestBody as PermissionRequest)
        })
        return res.json(handleSuccessResponse(permissionIncluded))
    } catch (err) {
        return handleThrowResponse(err, res)
    }
})

function validatePermissionRequestBody(requestBody: any): ApiResponse<string> | undefined {
    if (!requestBody)
        return handleFailResponse('O corpo da requisição não foi informado.')

    if (!requestBody.permissions || !Array.isArray(requestBody.permissions) || requestBody.permissions.length === 0)
        return handleFailResponse('As permissões não foram informadas.')

    return undefined
}

function getPermissionService(): PermissionService {
    return getService('permission') as PermissionService
}

export default permissionRoutes
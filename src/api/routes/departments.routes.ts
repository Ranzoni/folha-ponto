import { Router, type Request, type Response } from "express"
import { handleFailResponse, handleSuccessResponse, handleThrowResponse } from "../models/api.response.js"
import type DepartmentResponse from "../models/department.response.js"
import { getService, transaction } from "../api-injector.js"
import type DepartmentService from "../../services/department-service.js"
import mapToFilterRequest from "../mappers/filter-request.mapper.js"

const departmentRoutes = Router()

departmentRoutes.post('/', async (req: Request, res: Response) => {
    const requestBody = req.body

    if (!requestBody || !requestBody.name)
        return res.status(400).json(handleFailResponse('Request name was not found.'))

    try {
        const departmentCreated = await transaction<DepartmentResponse>(async () => {
            return await getDepartmentService()
                .createDepartment(requestBody.name)
        })
        return res.status(201).json(handleSuccessResponse(departmentCreated))
    } catch (err) {
        return handleThrowResponse(err, res)
    }
})

departmentRoutes.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    const requestBody = req.body

    if (!id || !+id)
        return res.status(400).json(handleFailResponse('Request ID was not found.'))

    if (!requestBody || !requestBody.name)
        return res.status(400).json(handleFailResponse('Request name was not found.'))

    try {
        const departmentUpdated = await transaction<DepartmentResponse>(async () => {
            return await getDepartmentService()
                .updateDepartment(+id, requestBody.name)
        })
        return res.json(handleSuccessResponse(departmentUpdated))
    } catch (err) {
        return handleThrowResponse(err, res)
    }
})

departmentRoutes.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params

    if (!id || !+id)
        return res.status(400).json(handleFailResponse('Request ID was not found.'))

    try {
        await transaction<void>(async () => {
            await getDepartmentService()
                .removeDepartment(+id)
        })
        return res.json(handleSuccessResponse('The department was successfully removed.'))
    } catch (err) {
        return handleThrowResponse(err, res)
    }
})

departmentRoutes.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params

    if (!id || !+id)
        return res.status(400).json(handleFailResponse('Request ID was not found.'))

    try {
        const department = await transaction<DepartmentResponse>(async () => {
            return await getDepartmentService()
                .searchDepartment(+id)
        })
        return res.json(handleSuccessResponse(department))
    } catch (err) {
        return handleThrowResponse(err, res)
    }
})

departmentRoutes.get('/', async (req: Request, res: Response) => {
    try {
        const filters = mapToFilterRequest(req.query)
        if (!filters)
            return res.status(400).json(handleFailResponse('Request parameters was not found.'))

        const departments = await transaction<DepartmentResponse[]>(async () => {
            return await getDepartmentService()
                .searchDepartments(filters)
        }) ?? []
        return res.json(handleSuccessResponse(departments))
    } catch (err) {
        return handleThrowResponse(err, res)
    }
})

function getDepartmentService(): DepartmentService {
    return getService('department') as DepartmentService
}

export default departmentRoutes
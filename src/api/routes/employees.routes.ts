import { Router, type Request, type Response } from "express"
import { handleFailResponse, handleSuccessResponse, handleThrowResponse } from "../models/api.response.js"
import { getService, transaction } from "../api-injector.js"
import type { EmployeeRequest, EmployeeResponse } from "../models/employee.response.js"
import type EmployeeService from "../../services/employee-service.js"
import mapToFilterRequest from "../mappers/filter-request.mapper.js"

const employeeRoutes = Router()

employeeRoutes.post('/', async (req: Request, res: Response) => {
    const requestBody = req.body
    
    if (!requestBody)
        return res.status(400).json(handleFailResponse('Request was not informed.'))

    try {
        const employeeCreated = await transaction<EmployeeResponse>(async () => {
            return await getEmployeeService().createEmployee(requestBody as EmployeeRequest)
        })
        return res.status(201).json(handleSuccessResponse(employeeCreated))
    } catch (err) {
        return handleThrowResponse(err, res)
    }
})

employeeRoutes.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    const requestBody = req.body
    
    if (!id || !+id)
        return res.status(400).json(handleFailResponse('Request ID was not found.'))

    if (!requestBody)
        return res.status(400).json(handleFailResponse('Request was not informed.'))

    try {
        const employeeUpdated = await transaction<EmployeeResponse>(async () => {
            return await getEmployeeService().updateEmployee(+id, requestBody as EmployeeRequest)
        })
        return res.json(handleSuccessResponse(employeeUpdated))
    } catch (err) {
        return handleThrowResponse(err, res)
    }
})

employeeRoutes.put('/:id/activate', async (req: Request, res: Response) => {
    const { id } = req.params
    
    if (!id || !+id)
        return res.status(400).json(handleFailResponse('Request ID was not found.'))

    try {
        await transaction<void>(async () => {
            return await getEmployeeService().activate(+id, true)
        })
        return res.json(handleSuccessResponse('The employee was activated.'))
    } catch (err) {
        return handleThrowResponse(err, res)
    }
})

employeeRoutes.put('/:id/deactivate', async (req: Request, res: Response) => {
    const { id } = req.params
    const requestBody = req.body
    
    if (!id || !+id)
        return res.status(400).json(handleFailResponse('Request ID was not found.'))

    if (!requestBody)
        return res.status(400).json(handleFailResponse('Request was not informed.'))

    try {
        await transaction<void>(async () => {
            return await getEmployeeService().activate(+id, false)
        })
        return res.json(handleSuccessResponse('The employee was deactivated.'))
    } catch (err) {
        return handleThrowResponse(err, res)
    }
})

employeeRoutes.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    
    if (!id || !+id)
        return res.status(400).json(handleFailResponse('Request ID was not found.'))

    try {
        await transaction<void>(async () => {
            return await getEmployeeService().removeEmployee(+id)
        })
        return res.json(handleSuccessResponse('The employee was successfully removed.'))
    } catch (err) {
        return handleThrowResponse(err, res)
    }
})

employeeRoutes.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params

    if (!id || !+id)
        return res.status(400).json(handleFailResponse('Request ID was not found.'))

    try {
        const employee = await transaction<EmployeeResponse>(async () => {
            return await getEmployeeService().searchEmployee(+id)
        })
        return res.json(handleSuccessResponse(employee))
    } catch (err) {
        return handleThrowResponse(err, res)
    }
})

employeeRoutes.get('/', async (req: Request, res: Response) => {
    try {
        const filters = mapToFilterRequest(req.query)
        if (!filters)
            return res.status(400).json(handleFailResponse('Request parameters was not found.'))

        const employee = await transaction<EmployeeResponse[]>(async () => {
            return await getEmployeeService().searchEmployees(filters)
        })
        return res.json(handleSuccessResponse(employee))
    } catch (err) {
        return handleThrowResponse(err, res)
    }
})

function getEmployeeService(): EmployeeService {
    return getService('employee') as EmployeeService
}

export default employeeRoutes
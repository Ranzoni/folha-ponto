import { Router, type Request, type Response } from "express"
import { handleFailResponse, handleSuccessResponse, handleThrowResponse, type ApiResponse } from "../models/api.response.js"
import { getService, transaction } from "../api-injector.js"
import type { EmployeeRequest, EmployeeResponse } from "../models/employee.response.js"
import type EmployeeService from "../../services/employee-service.js"
import mapToFilterRequest from "../mappers/filter-request.mapper.js"
import { isNumberPrimitive } from "../../domain/shared/utils-functions.js"

const employeeRoutes = Router()

employeeRoutes.post('/', async (req: Request, res: Response) => {
    const requestBody = req.body
    
    const validation = validateEmployeeRequestBody(requestBody)
    if (validation)
        return res.status(400).json(validation)

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

    const validation = validateEmployeeRequestBody(requestBody)
    if (validation)
        return res.status(400).json(validation)

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
    
    if (!id || !+id)
        return res.status(400).json(handleFailResponse('Request ID was not found.'))

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

function validateEmployeeRequestBody(requestBody: any): ApiResponse<string> | undefined {
    if (!requestBody)
        return handleFailResponse('Request was not informed.')

    if (!requestBody.name)
        return handleFailResponse('Request name was not found.')

    if (!requestBody.workSchedule)
        return handleFailResponse('Request work schedule was not found.')

    if (!isNumberPrimitive(requestBody.workSchedule.firstPeriodStart))
        return handleFailResponse('Request first period start was not found.')

    if (!isNumberPrimitive(requestBody.workSchedule.firstPeriodEnd))
        return handleFailResponse('Request first period end was not found.')

    if (isNumberPrimitive(requestBody.workSchedule.lunchPeriodStart) || isNumberPrimitive(requestBody.workSchedule.lunchPeriodEnd)) {
        if (!isNumberPrimitive(requestBody.workSchedule.lunchPeriodStart))
            return handleFailResponse('Invalid request lunch period start.')

        if (!isNumberPrimitive(requestBody.workSchedule.lunchPeriodEnd))
            return handleFailResponse('Invalid request lunch period end.')
    }

    if (isNumberPrimitive(requestBody.workSchedule.secondPeriodStart) || isNumberPrimitive(requestBody.workSchedule.secondPeriodEnd)) {
        if (!isNumberPrimitive(requestBody.workSchedule.secondPeriodStart))
            return handleFailResponse('Invalid request second period start.')

        if (!isNumberPrimitive(requestBody.workSchedule.secondPeriodEnd))
            return handleFailResponse('Invalid request second period end.')
    }

    if (!requestBody.departmentId)
        return handleFailResponse('Request department ID was not found.')

    if (!requestBody.roleId)
        return handleFailResponse('Request role ID was not found.')

    return undefined
}

export default employeeRoutes
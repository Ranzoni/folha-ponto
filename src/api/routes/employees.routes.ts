import { Router, type Request, type Response } from "express"
import { handleFailResponse, handleSuccessResponse, handleThrowResponse, type ApiResponse } from "../models/api.response.js"
import { getService, transaction } from "../api-injector.js"
import type { EmployeeRequest } from "../models/employees/employee.request.js"
import type { EmployeeResponse } from "../models/employees/employee.response.js"
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
        return res.status(400).json(handleFailResponse('O ID do funcionário não foi informado na requisição.'))

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
        return res.status(400).json(handleFailResponse('O ID do funcionário não foi informado na requisição.'))

    try {
        await transaction<void>(async () => {
            return await getEmployeeService().removeEmployee(+id)
        })
        return res.json(handleSuccessResponse('O funcionário foi removido com sucesso.'))
    } catch (err) {
        return handleThrowResponse(err, res)
    }
})

employeeRoutes.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params

    if (!id || !+id)
        return res.status(400).json(handleFailResponse('O ID do funcionário não foi informado na requisição.'))

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
            return res.status(400).json(handleFailResponse('Os parâmetros não foram informados na requisição.'))

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
        return handleFailResponse('O corpo da requisição não foi informado.')

    if (!requestBody.name)
        return handleFailResponse('O nome do funcionário não foi informado.')

    if (!requestBody.workSchedule)
        return handleFailResponse('A escala de trabalho do funcionário não foi informada.')

    if (!isNumberPrimitive(requestBody.workSchedule.firstPeriodStart))
        return handleFailResponse('O início do primeiro período de trabalho não foi informado.')

    if (!isNumberPrimitive(requestBody.workSchedule.firstPeriodEnd))
        return handleFailResponse('O fim do primeiro período de trabalho não foi informado.')

    if (isNumberPrimitive(requestBody.workSchedule.lunchPeriodStart) || isNumberPrimitive(requestBody.workSchedule.lunchPeriodEnd)) {
        if (!isNumberPrimitive(requestBody.workSchedule.lunchPeriodStart))
            return handleFailResponse('O valor informado para o início do horário de almoço é inválido.')

        if (!isNumberPrimitive(requestBody.workSchedule.lunchPeriodEnd))
            return handleFailResponse('O valor informado para o fim do horário de almoço é inválido.')
    }

    if (isNumberPrimitive(requestBody.workSchedule.secondPeriodStart) || isNumberPrimitive(requestBody.workSchedule.secondPeriodEnd)) {
        if (!isNumberPrimitive(requestBody.workSchedule.secondPeriodStart))
            return handleFailResponse('O valor informado para o início do segundo período é inválido.')

        if (!isNumberPrimitive(requestBody.workSchedule.secondPeriodEnd))
            return handleFailResponse('O valor informado para o fim do segundo período é inválido.')
    }

    if (!requestBody.departmentId)
        return handleFailResponse('O departamento do funcionário não foi informado.')

    if (!requestBody.roleId)
        return handleFailResponse('O cargo do funcionário não foi informado.')

    return undefined
}

export default employeeRoutes
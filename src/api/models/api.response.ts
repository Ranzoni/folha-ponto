import DomainError from "../../domain/errors/domain.error.js"
import type { Response } from "express"

interface ApiResponse<T> {
    success: boolean
    resource: T
}

function handleSuccessResponse<T>(model: T): ApiResponse<T> {
    const response: ApiResponse<T> = {
        success: true,
        resource: model
    }

    return response
}

function handleFailResponse(message: string): ApiResponse<string> {
    const response: ApiResponse<string> = {
        success: false,
        resource: message
    }

    return response
}

function handleThrowResponse(err: any, res: Response): any {
    let status = 500
    let apiResponse: ApiResponse<string>

    if (err instanceof DomainError) {
        status = 422
        apiResponse = handleFailResponse(err.message)
    }
    else if (err instanceof Error)
        apiResponse = handleFailResponse(err.message)
    else 
        apiResponse = handleFailResponse('Not mapped error found.')

    return res.status(status).json(apiResponse)
}

export { type ApiResponse, handleSuccessResponse, handleFailResponse, handleThrowResponse }
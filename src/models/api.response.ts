export default interface ApiResponse<T> {
    success: boolean
    resource: T
}

export function mapToSuccessApiResponse<T>(model: T): ApiResponse<T> | any {
    const response: ApiResponse<T> = {
        success: true,
        resource: model
    }

    return response
}

export function mapToFailApiResponse(message: string): ApiResponse<string> | any {
    const response: ApiResponse<string> = {
        success: false,
        resource: message
    }

    return response
}
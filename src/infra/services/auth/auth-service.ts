import AuthError from "../../errors/auth.error.js"

async function createUser(user: UserRequest): Promise<UserResponse> {
    const adminUserAuthenticated = await authenticate(process.env.AUTH_ADMIN!, process.env.AUTH_PASS!)
    
    const response = await postApi('user', user, adminUserAuthenticated.token)
    if (!response.ok)
        AuthError.unsuccessfulResponse()

    return await response.json() as UserResponse
}

async function authenticate(username: string, password: string): Promise<AuthResponse> {
    const response = await postApi('user/authenticate', { username, password })
    if (!response.ok)
        AuthError.notAuthenticated()

    return await response.json() as AuthResponse
}

async function postApi(action: string, data: any = undefined, token: string | undefined = undefined): Promise<Response> {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Chave-API': process.env.AUTH_API_KEY!,
    }

    if (token)
        headers['Authorization'] =  `Bearer ${token}`

    const response = await fetch(`${process.env.AUTH_API}/${action}`, {
        method: 'POST',
        headers,
        body: data ? JSON.stringify(data) : null
    })

    return response
}

interface UserRequest {
    name: string
    username: string
    email: string
    password: string
}

interface UserResponse {
    id: string
    username: string
    email: string
}

interface AuthResponse {
    token: string
}

export { createUser, authenticate, type UserRequest, type UserResponse }
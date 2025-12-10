export default class AuthError extends Error {
    static unsuccessfulResponse(): void {
        throw new AuthError('A API de autenticação não retorno uma resposta válida.')
    }

    static notAuthenticated(): void {
        throw new AuthError('Não foi possível se autenticar na API de autenticação.')
    }
}
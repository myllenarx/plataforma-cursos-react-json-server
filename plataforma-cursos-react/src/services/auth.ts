export type PerfilUsuario = "ALUNO" | "PROFESSOR" | "ADMIN"

type JwtPayload = {
    sub: number
    email: string
    perfil: PerfilUsuario
    iat?: number
    exp?: number
}

export function getToken() {
    return localStorage.getItem("access_token")
}

export function getUsuarioLogado(): JwtPayload | null {
    const token = getToken()

    if (!token) {
        return null
    }

    try {
        const partes = token.split(".")

        if (partes.length !== 3) {
            return null
        }

        const payloadBase64 = partes[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/")

        const payload = JSON.parse(
            decodeURIComponent(
                atob(payloadBase64)
                    .split("")
                    .map(
                        (caractere) =>
                            "%" +
                            ("00" + caractere.charCodeAt(0).toString(16)).slice(-2)
                    )
                    .join("")
            )
        ) as JwtPayload

        if (payload.exp && payload.exp * 1000 < Date.now()) {
            localStorage.removeItem("access_token")
            return null
        }

        return payload
    } catch {
        return null
    }
}

export function estaAutenticado() {
    return getUsuarioLogado() !== null
}

export function logout() {
    localStorage.removeItem("access_token")
}
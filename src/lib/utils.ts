import type { Request } from "express"

export function getToken(req: Request) {
  const [type, token] = req.headers.authorization?.split(" ") || []

  if (type === "Bearer" && token) {
    return token
  }

  if (req.cookies?.token) {
    return req.cookies.token
  }
  
  return ""
}
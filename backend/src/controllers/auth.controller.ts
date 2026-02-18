import { Request, Response } from 'express'
import { registerSchema, loginSchema } from '../schemas/auth.schema'
import { AuthService } from '../services/auth.service'

export class AuthController {
  static async register(req: Request, res: Response) {
    const parsed = registerSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.flatten() })
    }

    await AuthService.register(parsed.data)
    res.status(201).json({ message: 'Usuario registrado' })
  }

  static async login(req: Request, res: Response) {
    const parsed = loginSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.flatten() })
    }

    const result = await AuthService.login(parsed.data)
    res.json(result)
  }
}

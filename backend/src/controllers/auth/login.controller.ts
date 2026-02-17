import { Request, Response } from 'express'
import { LoginService } from '../../services/auth/login.service'
import { LoginDTO } from '../../schemas/auth/login.schema'

export class LoginController {
  static async login(req: Request, res: Response) {
    try {
      const data: LoginDTO = req.body
      const result = await LoginService.login(data)
      res.json(result)
    } catch (error) {
      res.status(400).json({ message: (error as Error).message })
    }
  }
}

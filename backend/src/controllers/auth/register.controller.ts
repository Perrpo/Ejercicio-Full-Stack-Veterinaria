import { Request, Response } from 'express'
import { RegisterService } from '../../services/auth/register.service'
import { RegisterDTO } from '../../schemas/auth/register.schema'

export class RegisterController {
  static async register(req: Request, res: Response) {
    try {
      const data: RegisterDTO = req.body
      await RegisterService.register(data)
      res.status(201).json({ message: 'Usuario registrado exitosamente' })
    } catch (error) {
      res.status(400).json({ message: (error as Error).message })
    }
  }
}

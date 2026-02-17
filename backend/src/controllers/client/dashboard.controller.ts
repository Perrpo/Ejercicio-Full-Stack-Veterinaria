import { Request, Response } from 'express'
import { DashboardService } from '../../services/client/dashboard.service'

export class DashboardController {
  static async getDashboard(req: Request, res: Response) {
    try {
      const userId = req.user!.sub
      const supabase = req.supabase!
      const data = await DashboardService.getDashboard(userId, supabase)
      res.json(data)
    } catch (error) {
      res.status(500).json({ message: (error as Error).message })
    }
  }
}

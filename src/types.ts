import { JwtPayload } from 'jwt-decode'

export interface FstvlLifeJwtPayload extends JwtPayload {
  id: string
}

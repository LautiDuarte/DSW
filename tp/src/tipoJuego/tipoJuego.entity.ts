import crypto from 'node:crypto'

export class tipoJuego{
  constructor(
    public name: string,
    public description: string,
    public id = crypto.randomUUID()
  ){}

}
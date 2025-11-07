import 'dotenv/config'
import express, { type Request, type Response } from 'express'
import ruleRoutes from './api/routes/rules.routes.js'

const app = express()
app.use(express.json()) 

app.use('/api/rules', ruleRoutes)

app.get('/', (_: Request, res: Response) => {
    return res.json({ message: 'Folha de Ponto está funcionando!!' })
})

app.listen(3000, () => {
    console.log('A API - Folha de ponto está rodando!')
})
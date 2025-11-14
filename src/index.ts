import 'dotenv/config'
import express, { type Request, type Response } from 'express'
import roleRoutes from './api/routes/roles.routes.js'
import departmentRoutes from './api/routes/departments.routes.js'
import employeeRoutes from './api/routes/employees.routes.js'

const app = express()
app.use(express.json()) 

app.use('/api/roles', roleRoutes)
app.use('/api/departments', departmentRoutes)
app.use('/api/employees', employeeRoutes)

app.get('/', (_: Request, res: Response) => {
    return res.json({ message: 'Folha de Ponto está funcionando!!' })
})

app.listen(3000, () => {
    console.log('A API - Folha de ponto está rodando!')
})
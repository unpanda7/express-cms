import express from 'express'
import authRoutes from './routes/auth.routes'
import managementRoutes from './routes/management.routes'
import postRoutes from './routes/post.routes'
import Logger from './lib/logger'
import morganMiddleware from './middlewares/morganMiddleware'
import { authMiddleware, hasRole } from './middlewares/auth.middleware'
import { setupSwagger } from './config/swagger.config'

const app = express()

// 设置 Swagger
setupSwagger(app)

app.use(morganMiddleware)
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/management', managementRoutes)
app.use('/post', postRoutes)


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  Logger.info(`Server is running on port ${PORT}`)
})

export default app

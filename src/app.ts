import express from 'express'
import authRoutes from './routes/auth.routes'
import Logger from './lib/logger'
import morganMiddleware from './middlewares/morganMiddleware'
import { authMiddleware, hasRole } from './middlewares/auth.middleware'
const app = express()

app.use(morganMiddleware)
app.use(express.json())

app.use('/auth', authRoutes)


app.get(
  '/protected',
  authMiddleware,
  hasRole(['admin']),
  (req, res) => {
    res.json({ message: 'Protected route' })
  }
)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  // console.log(`Server is running on port ${PORT}`)
  Logger.info(`Server is running on port ${PORT}`)
})

export default app

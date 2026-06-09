import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import jobsRouter from './routes/jobs'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(helmet())
app.use(cors({ origin: 'https://hireflow-smoky.vercel.app' }))
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }))
app.use(express.json())

app.use('/jobs', jobsRouter)

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import connectCloudinary from './configs/cloudinary.js'
import userRouter from './routes/userRoutes.js'
import { clerkMiddleware } from '@clerk/express'
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js'
import educatorRouter from './routes/educatorRoutes.js'
import courseRouter from './routes/courseRoute.js'

// Initialize Express
const app = express()

// ✅ Connect DB & Cloudinary (safe for serverless)
let isConnected = false;

const initConnections = async () => {
  if (isConnected) return;
  await connectDB();
  await connectCloudinary();
  isConnected = true;
};

// ✅ CORS FIX
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}))

// ✅ Handle preflight requests
app.options("*", cors());

// Middlewares
app.use(clerkMiddleware())
app.use(express.json())

// Routes
app.get('/', (req, res) => {
  res.send("API Working")
})
// Routes
app.get('/', (req, res) => res.send("API Working"))
app.post('/clerk', express.json() , clerkWebhooks)
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks)
app.use('/api/educator', express.json(), educatorRouter)
app.use('/api/course', express.json(), courseRouter)
app.use('/api/user', express.json(), userRouter)


export default app;

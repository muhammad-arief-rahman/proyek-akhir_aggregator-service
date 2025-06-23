import { response } from '@ariefrahman39/shared-utils'
import express from 'express';
import multer from 'multer';

const app = express()
const port = process.env.PORT || 5100;

app.use(express.json({ limit: '50mb' }))
app.use(multer().any())

app.use((req, res) => {
  response(res, 404, 'Not Found')
})

app.listen(port, () => {
  console.log(`Aggregator-Service is running on port ${port}`)
})
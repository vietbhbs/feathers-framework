import { app } from './app'
import { logger } from './logger'

import mongoose from 'mongoose';

async function connectMongoDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/nodejs_bms');
    console.log('Mongoose connect successfully!');
  } catch (error) {
    console.log('Mongoose connect failure!');
  }
}

const port = app.get('port')
const host = app.get('host')

app.listen(port).then(async () => {
  await connectMongoDB();
  logger.info(`Feathers app listening on http://${host}:${port}`)
})

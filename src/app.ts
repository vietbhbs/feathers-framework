import { feathers } from '@feathersjs/feathers'
import express, {
  rest,
  json,
  urlencoded,
  cors,
  compression,
  serveStatic,
  notFound,
  errorHandler
} from '@feathersjs/express'
import configuration from '@feathersjs/configuration'
import socketio from '@feathersjs/socketio'

import type { Application } from './declarations'
import { configurationValidator } from './schemas/configuration'
import { logger, logErrorHook } from './logger'
import { mongodb } from './mongodb'
import { authentication } from './authentication'
import { services } from './services/index'
import { channels } from './channels'
import { graphqlHTTP } from 'express-graphql';
import { schema } from './schema/schema';
import { resolver } from './resolver';
import routes from './routes';

const app: Application = express(feathers())

// Load app configuration
app.configure(configuration(configurationValidator))
app.use(cors())
app.use(compression())
app.use(json())
app.use(urlencoded({ extended: true }))
// Host the public folder
app.use('/', serveStatic(app.get('public')))
app.use('/api', routes);

app.use(
    '/graphql',
    graphqlHTTP(() => ({
      schema,
      rootValue: resolver,
      graphiql: true,
      customFormatErrorFn: (err: any) => {
        if (!err.originalError) {
          return err;
        }
        const { data } = err.originalError;
        const message = err.message || 'An error occurred.';
        const code = err.originalError.code || 500;
        return {
          message: message,
          status: code,
          data: data,
        };
      },
    })),
);
// Configure services and real-time functionality
app.configure(rest())
app.configure(
  socketio({
    cors: {
      origin: app.get('origins')
    }
  })
)
app.configure(mongodb)
app.configure(authentication)
app.configure(services)
app.configure(channels)

// Configure a middleware for 404s and the error handler
app.use(notFound())
app.use(errorHandler({ logger }))

// Register hooks that run on all service methods
app.hooks({
  around: {
    all: [logErrorHook]
  },
  before: {},
  after: {},
  error: {}
})
// Register application setup and teardown hooks here
app.hooks({
  setup: [],
  teardown: []
})

export { app }

import { Router } from 'express';
import book from './book';

const routes = Router();

routes.use('/book', book);

export default routes;

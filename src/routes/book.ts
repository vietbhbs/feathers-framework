import {Router} from "express"
import { resolverBook } from 'nodejs-book-modules';

const router = Router();

router.post('/', resolverBook.books);
router.post('/show', resolverBook.book);
router.post('/add', resolverBook.createBook);
router.post('/update', resolverBook.updateBook);
router.post('/delete', resolverBook.deleteBook);

export default router;

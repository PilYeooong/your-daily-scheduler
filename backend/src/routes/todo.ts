import * as express from 'express';
import { verifyJWT } from '../controllers/jwt';
import { addTodo } from '../controllers/todo';

const router = express.Router();

router.post('/', verifyJWT, addTodo);

export default router;

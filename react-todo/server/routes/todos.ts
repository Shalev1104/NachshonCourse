
import express from 'express';
import { get, insert, remove, update } from '../controller/firebaseMethods';
import verifyFirebaseToken from '../middlewares/verifyAuth';

const router = express.Router({ mergeParams : true });
router.use(verifyFirebaseToken);


const table = "Todos";

router.get('/', async (req : express.Request, res : express.Response) => {
    return res.status(200).json(await get(table, {userId : req.params.userId}));
});

router.get('/:id', async (req : express.Request, res : express.Response) => {
    return res.status(200).json(await get(table,{id : req.params.id}));
});

router.post('/', async (req : express.Request, res : express.Response) => {
    return res.status(201).json(await insert(table, { userId : req.params.userId, ...req.body }));
});

router.put('/:id', async (req : express.Request, res : express.Response) => {
    return res.status(200).json({ update : await update(table, req.params.id, {userId : req.params.userId, ...req.body})});
});

router.delete('/:id', async (req : express.Request, res : express.Response) => {
    return res.status(200).json({ delete : await remove(table, req.params.id)});
});

module.exports = router;
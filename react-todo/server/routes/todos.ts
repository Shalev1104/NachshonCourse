
import express from 'express';
import { get, insert, remove, update } from '../controller/firebaseMethods';

const router = express.Router();
const table = "Todos";

router.get('/', async (req : express.Request, res : express.Response) => {
    return res.status(200).json(await get(table));
});

router.get('/:id', async (req : express.Request, res : express.Response) => {
    return res.status(200).json(await get(table, req.params.id));
});

router.post('/', async (req : express.Request, res : express.Response) => {
    return res.status(201).json(await insert(table, { ...req.body }));
});

router.put('/:id', async (req : express.Request, res : express.Response) => {
    return res.status(200).json({ update : await update(table, req.params.id, {...req.body})});
});

router.delete('/:id', async (req : express.Request, res : express.Response) => {
    return res.status(200).json({ delete : await remove(table, req.params.id)});
});

module.exports = router;
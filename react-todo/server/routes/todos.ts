import express from "express";
import { get, insert, remove, update } from '../../controller/Todos';

const router = express.Router();


router.get('/', async (req : express.Request, res : express.Response, next : express.NextFunction) => {
    return res.status(200).json(await get());
});

router.get('/:id', async (req : express.Request, res : express.Response, next : express.NextFunction) => {
    return res.status(200).json(await get(req.params.id));
});

router.post('/', async (req : express.Request, res : express.Response, next : express.NextFunction) => {
    return res.status(201).json(await insert({ ...req.body }));
});

router.put('/:id', async (req : express.Request, res : express.Response, next : express.NextFunction) => {
    return res.status(204).json(await update(req.params.id, {...req.body}));
});

router.delete('/:id', async (req : express.Request, res : express.Response, next : express.NextFunction) => {
    return res.status(204).json(await remove(req.params.id));
});
import {Router} from "express";
import { supplierRouter } from "./supplier";

export const apiRouter = Router();

apiRouter.use('/supplier', supplierRouter);

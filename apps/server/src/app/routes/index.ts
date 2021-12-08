import {Router} from "express";
import { supplierRouter } from "./supplier";
import { distributorRouter } from "./distributor";
import { outletRouter } from "./outlet";

export const apiRouter = Router();

apiRouter.use('/supplier', supplierRouter);
apiRouter.use('/distributor', distributorRouter);
apiRouter.use('/outlet', outletRouter);

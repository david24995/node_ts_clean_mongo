import { Router } from "express";
import { FileUploadController } from "./controller";
import { FileUploadService } from "../services/fiel-upload.service";
import { UploadMiddleware } from "../middlewares/upload.middleware";
import { TypeMiddleware } from "../middlewares/type.middleware";


export class FileUploadRoutes {

  static get routes(): Router {

    const router = Router();
    const service = new FileUploadService();
    const controller = new FileUploadController(service);

    router.use(UploadMiddleware.containFiles);
    router.use(TypeMiddleware.validTypes(['users','products','categories']));

    router.post('/single/:type', controller.uploadFile)
    router.post('/multiple/:type', controller.uploadMultipleFile);
    return router;

  }

}
import { Router } from "express";
import { ImageController } from "./controller";


export class ImageRoutes {

  static get routes(): Router {

    const controller = new ImageController();

    const router = Router();

    router.get('/:type/:img', controller.getImage)

    return router;
  }

}
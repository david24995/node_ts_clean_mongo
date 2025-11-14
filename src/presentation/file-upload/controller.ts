import { Request, Response } from "express";
import { CustomError } from "../../domain";
import { FileUploadService } from "../services/fiel-upload.service";
import { UploadedFile } from "express-fileupload";


export class FileUploadController {

  constructor(private readonly fileUploadService: FileUploadService) {}

  private handleError = (error:unknown, res: Response) => {

    if(error instanceof CustomError) {
      return res.status(error.statusCode).json({error});
    }

    console.log(`${error}`);

    return res.status(500).json({error: 'Internal Server Error'});

  }

  uploadFile = (req:Request, res: Response) => {

    const type = req.params.type;
    const file = req.body.files.at(0) as UploadedFile;

    this.fileUploadService.uploadSingle(file, `upload/${type}`)
      .then( uploaded => (res.json(uploaded)) )
      .catch(err => this.handleError(err, res));

  }
  uploadMultipleFile = (req:Request, res: Response) => {

    const type = req.params.type;
    const file = req.body.files as UploadedFile[];

    this.fileUploadService.uploadMultiple(file, `upload/${type}`)
      .then( uploaded => (res.json(uploaded)) )
      .catch(err => this.handleError(err, res));

    
    res.json('uploadMultipleFile')

  }

}
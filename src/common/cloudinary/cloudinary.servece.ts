import { Injectable } from "@nestjs/common";
import { cloudinaryConfig } from "./cloudinary";
import {Express} from 'express'
import { UploadApiOptions } from "cloudinary";
@Injectable()
export class CloudinaryServece {
    constructor(){}
    private _cloudinary = cloudinaryConfig();
    async uploadFile(file: Express.Multer.File , options:UploadApiOptions) {
        return await this._cloudinary.uploader.upload(file.path , options)
    }
    async deleteFile(publicId: string) {
        return await this._cloudinary.uploader.destroy(publicId)
   }
   async uploadFiles(files : Express.Multer.File[] , options:UploadApiOptions) {
    let result : {secure_url : string,public_id : string}[] = []
      for (const file of files) {
         const {secure_url,public_id} = await this.uploadFile(file, options)
         result.push({secure_url,public_id})
      }
      return result
   }
   async deleteFolder(folderName : string) {
    await this._cloudinary.api.delete_resources_by_prefix(folderName)
    return  await this._cloudinary.api.delete_folder(folderName)
   }
}
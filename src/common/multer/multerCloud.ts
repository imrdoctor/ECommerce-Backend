import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { Express, Request } from 'express';
import * as path from 'path';
import * as fs from 'fs';

interface MulterOptions {
    allowedExtension: string[];
}

export const multerCloudConfig = ({ allowedExtension }: MulterOptions) => {
    const storage = diskStorage({});

    const fileFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
        if (!allowedExtension.includes(file.mimetype)) {
            return cb(
                new BadRequestException(`This file type is not allowed. Allowed file types are: ${allowedExtension.join(', ')}`),
                false,
            );
        }
        cb(null, true);
    };

    return { fileFilter, storage };
};

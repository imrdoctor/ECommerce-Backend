import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { Express, Request } from 'express';
import * as path from 'path';
import * as fs from 'fs';

interface MulterOptions {
    uploadPath: string;
    allowedExtension: string[];
}

export const multerConfig = ({ uploadPath = 'General', allowedExtension }: MulterOptions) => {
    const storage = diskStorage({
        destination: (req, file, cb) => {
            const destPath = `uploads/${uploadPath}`;
            if (!fs.existsSync(destPath)) {
                fs.mkdirSync(destPath, { recursive: true });
            }
            cb(null, destPath);
        },
        filename: (req, file, cb) => {
            const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
            const filename = `${Date.now()}-${sanitizedFilename}`;
            cb(null, filename);
        },
    });

    const fileFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
        if (!allowedExtension.includes(file.mimetype)) {
            return cb(
                new BadRequestException(`File type ${file.mimetype} is not allowed`),
                false,
            );
        }
        cb(null, true);
    };

    return { fileFilter, storage };
};

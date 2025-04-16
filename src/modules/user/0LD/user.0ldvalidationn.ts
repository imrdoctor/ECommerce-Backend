// import { BadRequestException } from '@nestjs/common';
// import {z} from 'zod';
// export const userValidation = z.object({
//     name: z.string().min(3,{message:"name is very small"}).max(50,{message:"name is very big"}).trim(),
//     email: z.string().email(),
//     password: z.string().min(8).max(50),
//     confirmPassword: z.string().min(8).max(50),
//     id: z.number().int().positive()
// }).required().strict().superRefine((data , ctx) => {    
//     if(data.password !== data.confirmPassword){
//         ctx.addIssue({
//             code: z.ZodIssueCode.custom,
//             message: 'Password and confirm password must be same',
//         })
//     }
// });
// export type userValidationDto = z.infer<typeof userValidation>;
import * as bycrpt from 'bcrypt';

export const Hash=(plainText:string,saltRounds:number = Number(process.env.SALT_ROUND)) : string=>{
    return bycrpt.hashSync(plainText,saltRounds);
}
export const CompareHash=(plainText:string,hash:string) : boolean=>{
    return bycrpt.compareSync(plainText,hash);
}
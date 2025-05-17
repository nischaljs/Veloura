import type { Request, Response } from "express"
import AppError from "../lib/AppError"
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import AppSuccess from "../lib/AppSuccess";


const hashPassword = async(password:string) : Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

const comparePassword = async(password:string, hash:string) =>{
    return await bcrypt.compare(password, hash);
}

const authController = {
    userLogin:async (req:Request, res:Response) => {
       try {
        const {email, password} = req.body;
        if(!email){
            new AppError("email is required",500,true);
        }
        if(!password){
            new AppError("password is required",500,true);
        }
        const {dbUser, passwordHash} = await prisma.user.findUnique({
            where: {
                email
            }
            
        })

        if(!dbUser){
            new AppError("user not found",500,true);
        }
        const isPasswordValid = await comparePassword(password, passwordHash);
        if(!isPasswordValid){
            new AppError("email or password is incorrect",500,true);
        }
        new AppSuccess(dbUser,"Login successful",200).send(res);

       } catch (error:any) {
        new AppError(error?.message, 400);
       }
    },
    userRegister: (req:Request, res:Response) => {
        try {
            const {email, password, firstName, lastName, avatarUrl, phone} = req.body;
        } catch (error) {
            
        }
    },
    logout: (req:Request, res:Response) => {
        res.send('logout')
    },
    vendorLogin: (req:Request, res:Response) => {
        res.send('vendor login')
    },
    vendorRegister: (req:Request, res:Response) => {
        res.send('vendor register')
    },

}

export default authController;
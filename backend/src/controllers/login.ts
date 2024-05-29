import { NextFunction, Request, RequestHandler, Response } from "express";
import loginModel from "../models/loginModel";
import { SessionData } from "express-session";
import gasDataModel from "../models/gasDataModel";
import oilDataModel from "../models/oilDataModel";
import employeeDataModel from "../models/employeeDataModel";
import filterDataModel from "../models/filterDataModel";
import employeeDataInterface from "../models/employeeDataInterface";
import io from "../server"

interface MySessionData extends SessionData{
    user?:string;
    isLogged?:boolean;
    role?:string;
}

export const checkLogin:RequestHandler=async(req:Request,res:Response,next:NextFunction)=>{
    const myindustryid=req.body.industryid;
    const mypassword=req.body.password;
    const myrole=req.body.role;
    try{
        const cred=await loginModel.find({industryid:myindustryid}).exec();
        if(cred.length===0){
            res.status(404).json({error:"Username not found"});
        }
        else{
            if(cred[0].password!==mypassword){
                res.status(406).json({error:"Invalid password"});
            }
            else{
                if(cred[0].role!==myrole){
                    res.status(407).json({error:"Invalid role"});
                }
                else{
                    (req.session as MySessionData).user=myindustryid;
                    (req.session as MySessionData).isLogged=true;
                    (req.session as MySessionData).role=myrole;
                    res.cookie("loginCookie_ERMS",myindustryid,{maxAge:36000000,httpOnly:false});
                    res.status(200).json({message:"Login successful"});
                }
            }
        }
    }
    catch(error){
        next(error);
    }
}

export const checkSession:RequestHandler=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const isSession=(req.session as MySessionData).isLogged;
        if(isSession){
            res.status(200).json({message:"Session found",data:{
                username:(req.session as MySessionData).user,
                role:(req.session as MySessionData).role,
            }});
        }
        else{
            res.status(404).json({message:"Session not found"});
        }
    }
    catch(error){
        next(error)
    }
}

export const checkCookie:RequestHandler=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        if(req.cookies["loginCookie_ERMS"]){
            (req.session as MySessionData).user=req.cookies["loginCookie_ERMS"];
            (req.session as MySessionData).isLogged=true;
            res.status(200).json({message:"Cookie found",data:{
                username:(req.session as MySessionData).user,
                role:(req.session as MySessionData).role,
            }});
        }
        else{
            res.status(404).json({message:"Cookie not found"});
        }
    }
    catch(error){
        next(error)
    }
}

export const gasData:RequestHandler=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const data=await gasDataModel.find({}).sort({timeStamp:"desc"})
        res.status(200).json({data:data[0]})
    }
    catch(error){
        next(error)
    }
}

export const oilData:RequestHandler=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const data=await oilDataModel.find({}).sort({timeStamp:"desc"})
        res.status(200).json({data:data[0]})
    }
    catch(error){
        next(error)
    }
}

export const employeeStatus:RequestHandler=async(req:Request,res:Response,next:NextFunction)=>{
    const passValue:filterDataModel={}
    if(req.body){
        if(req.body.employeeID) passValue.employeeID=req.body.employeeID
        else{
            if(req.body.sectorNo) passValue.sectorNo=req.body.sectorNo
            if(req.body.attendance==="Present") passValue.attendance=true
            else if(req.body.attendance==="Absent") passValue.attendance=false
            if(req.body.evacuated==="Yes") passValue.evacuated=true
            else if(req.body.evacuated==="No") passValue.evacuated=false
            if(req.body.date) passValue.date=req.body.date
        }
    }
    try{
        const data=await employeeDataModel.find(passValue).exec()
        res.status(200).json({data:data})
    }
    catch(error){
        next(error)
    }
}

export const employeeManagement:RequestHandler=async(req:Request,res:Response,next:NextFunction)=>{
    const passValue:filterDataModel={}
    if(req.body){
        if(req.body.employeeID) passValue.employeeID=req.body.employeeID
        else{
            if(req.body.sectorNo) passValue.sectorNo=req.body.sectorNo
            if(req.body.attendance==="Present") passValue.attendance=true
            else if(req.body.attendance==="Absent") passValue.attendance=false
            if(req.body.evacuated==="Yes") passValue.evacuated=true
            else if(req.body.evacuated==="No") passValue.evacuated=false
            if(req.body.date) passValue.date=req.body.date
        }
    }
    try{
        const data=await employeeDataModel.find(passValue).exec()
        res.status(200).json({data:data})
    }
    catch(error){
        next(error)
    }
}

export const attendance:RequestHandler=async(req:Request,res:Response,next:NextFunction)=>{
    const {id,value,date}=req.body
    try{
        const data=await employeeDataModel.updateOne({employeeID:id,date:date},{attendance:value})
        res.status(200).json({data:"Updated",status:data})
    }
    catch(error){
        next(error)
    }
}

export const createDate:RequestHandler=async(req:Request,res:Response,next:NextFunction)=>{
    const date=req.body.date
    try{
        const data=await employeeDataModel.find({date:date})
        if(data.length>0){
            res.status(409).json({message:"Register already exists!"})
        }
        else{
            const newData=await employeeDataModel.find({date:"2024-01-01"})
            const newArr:employeeDataInterface[]=newData.map((item)=>{
                return{
                    employeeID:item.employeeID,
                    employeeName:item.employeeName,
                    sectorNo:item.sectorNo,
                    attendance:false,
                    evacuated:false,
                    date:date,
                }
            })
            const create=await employeeDataModel.insertMany(newArr)
            res.status(200).json({message:"Register created successfully",data:create.length})
        }
    }
    catch(error){
        next(error)
    }
}

export const fetchEvacuator:RequestHandler=async(req:Request,res:Response,next:NextFunction)=>{
    const {id,date}=req.body
    try{
        const data=await employeeDataModel.find({employeeID:id,date:date}).exec()
        res.status(200).json({status:data[0]})
    }
    catch(error){
        next(error)
    }
}

export const evacuator:RequestHandler=async(req:Request,res:Response,next:NextFunction)=>{
    const {id,value,date}=req.body
    try{
        const data=await employeeDataModel.updateOne({employeeID:id,date:date},{evacuated:value})
        res.status(200).json({updateStatus:"Updated",data:data,status:(!value)})
    }
    catch(error){
        next(error)
    }
}

export const storeData:RequestHandler=async(req:Request,res:Response,next:NextFunction)=>{
    console.log(req.body)
    try{
        const formattedDate:string=new Date().toISOString()
        const oilInsert=await oilDataModel.insertMany({
            oilValue:req.body.OV,
            oilStatus:req.body.OS?"GOOD":"BAD",
            sectorNo:1,
            timeStamp:formattedDate
        })
        const gasInsert=await gasDataModel.insertMany({
            gasValue:req.body.GV,
            gasStatus:req.body.GS?"GOOD":"BAD",
            sectorNo:2,
            timeStamp:formattedDate
        })
        console.log(oilInsert,gasInsert)
        res.status(200).json({message:"Success"})
    }
    catch(error){
        next(error)
    }
}

export const alert:RequestHandler=async(req:Request,res:Response,next:NextFunction)=>{
    console.log(req.body)
    const information=req.body.IT

    if(information==="A"){
        try{
            io.emit("alert",JSON.stringify(req.body))
            res.status(200).json({message:"Success"})
        }
        catch(error){
            next(error)
        }
    }

}

export const logout:RequestHandler=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        req.session.destroy((err)=>{
            if(err) res.status(500).json({message:"Error logging out"})
        })
        res.clearCookie("loginCookie_ERMS")
        res.status(200).json({message:"Logged out successfully"})
    }
    catch(error){
        next(error)
    }
}
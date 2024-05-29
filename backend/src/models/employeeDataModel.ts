import { InferSchemaType, Schema, model } from "mongoose"

const employeeDataModel=new Schema({
    employeeID:{
        type:String,
        required:true,
    },
    employeeName:{
        type:String,
        required:true,
    },
    sectorNo:{
        type:Number,
        required:true,
    },
    attendance:{
        type:Boolean,
        required:true,
    },
    evacuated:{
        type:Boolean,
        required:true,
    },
    date:{
        type:String,
        required:true,
    }
})

type employeeDataModelType=InferSchemaType<typeof employeeDataModel>

export default model<employeeDataModelType>("employeeDataModel",employeeDataModel,"employeeDataModel")
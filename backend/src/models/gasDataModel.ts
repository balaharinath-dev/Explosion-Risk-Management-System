import { Schema,InferSchemaType,model } from "mongoose";

const gasDataModel=new Schema({
    gasValue:{
        type:Number,
        required:true,
    },
    gasStatus:{
        type:String,
        required:true,
    },
    sectorNo:{
        type:Number,
        required:true
    },
    timeStamp:{
        type:String,
        required:true
    },
})

type gasDataModelType=InferSchemaType<typeof gasDataModel>

export default model<gasDataModelType>("gasDataModel",gasDataModel,"gasDataModel")
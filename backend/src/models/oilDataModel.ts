import { Schema,InferSchemaType,model } from "mongoose";

const oilDataModel=new Schema({
    oilValue:{
        type:Number,
        required:true,
    },
    oilStatus:{
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

type oilDataModelType=InferSchemaType<typeof oilDataModel>

export default model<oilDataModelType>("oilDataModel",oilDataModel,"oilDataModel")
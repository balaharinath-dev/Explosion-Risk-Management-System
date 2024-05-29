import { Schema,InferSchemaType, model } from "mongoose";

const loginModel=new Schema({
    industryid:{type:String,require:true,unique:true},
    password:{type:String,require:true},
    role:{type:String,require:true}
});

type loginModelType=InferSchemaType<typeof loginModel>;

export default model<loginModelType>("loginModel",loginModel,"loginModel");
import dotenv from "dotenv";
import { cleanEnv } from "envalid";
import { str,port } from "envalid/dist/validators";

dotenv.config();

export default cleanEnv(process.env,{
    MONGO_CONNECTION_STRING:str(),
    PORT:port(),
    SOCKET_PORT:port(),
});
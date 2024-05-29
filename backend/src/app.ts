import express, {NextFunction,Request,Response} from "express";
import morgan from "morgan";
import router from "./routes/login";
import createHttpError,{isHttpError} from "http-errors";
import cookieParser from "cookie-parser";
import session from "express-session";

const app=express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Expose-Headers", "Content-Length, X-Total-Count");
    next();
});

app.use(cookieParser());

app.use(session({
    secret: 'abcdefghi',
    name: 'hincorp_ERMS_session',
    resave: false,
    saveUninitialized: false,
    cookie:{
        httpOnly:false,
    }
    })
);

app.use(morgan("dev"));

app.use(express.json());

app.use("/",router);

app.use((req,res,next)=>{
    next((createHttpError(404,"Endpoint not found")));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error:unknown,req:Request,res:Response,next:NextFunction)=>{
    console.error(error);
    let errorMessage="An unknown error occured";
    let statusCode=500;
    if(isHttpError(error)){
        statusCode=error.statusCode;
        errorMessage=error.message;
    }
    res.status(statusCode).json({error:errorMessage});
});

export default app;
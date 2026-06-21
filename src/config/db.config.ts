import mongoose from "mongoose";
import logger from "./logger.config";
import { serverConfig } from ".";


export const connectDB=async ()=>{
    try{
        const dbUrl=serverConfig.DB_URI;
        await mongoose.connect(dbUrl);

        logger.info("Connected to mongo successfully");

       mongoose.connection.on("error",(error)=>{
        logger.error("mOngoDb coonection error",error);
       })
       mongoose.connection.on("disconnected",(error)=>{
        logger.warn("mOngoDb disconnected",error);
       })
       process.on("SIGINT",async()=>{
        await mongoose.connection.close();
        logger.info("Connection closed");
        process.exit(0);
       })
    }    catch(error){
        logger.error("Failed to connect mongo",error);
        process.exit(1);
    }
}
import { connect } from "mongoose";
const mongodnuri = process.env.MONGODB_URI ;
if( !mongodnuri){
    throw new Error("MONGODB_URI is not defined in environment variables");
}
let cached = global.mongoose;
if(!cached){ 
 cached = global.mongoose = { conn: null, promise: null }
}
const connectDB = async ()=>{
    if(cached.conn){
      
        return cached.conn;
    }
    if(!cached.promise){
        cached.promise = connect(mongodnuri).then((c)=>c.connection);
    }
    try {
       cached.conn = await cached.promise;
        
    } catch (error) {
        throw error;
    }
    return cached.conn;
}
export default connectDB;
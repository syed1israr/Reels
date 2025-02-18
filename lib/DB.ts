import mongoose from "mongoose";

const DB_URI = process.env.MONGO_URI!;

if( !DB_URI ){ throw new Error("Please Define URI in .env File");}

let cached = global.mongoose;

if( !cached ){ cached = global.mongoose = { conn : null, promise : null};}
 

export async function connectToDatabase() {

    if( cached.conn ){ return cached.conn; }
    if( !cached.promise ){ 
        const opt = {
            bufferCommands : true,
            maxPoolSize : 10
        }

        cached.promise = mongoose
        .connect(DB_URI,opt)
        .then(()=> mongoose.connection)
    }

    try {cached.conn = await cached.promise;} 
    catch (error) {cached.promise = null;throw new Error(`Error in DB File ${error}`); }
    return cached.conn;
}
import Pusher from "pusher";
import dotenv from 'dotenv';
dotenv.config();


const pusher = new Pusher({
    appId: process.env.APP_ID,
    key: process.env.KEY,
    secret: process.env.SECRET,
    cluster: process.env.CLUSTER,
    useTLS: true
});
export  {pusher};

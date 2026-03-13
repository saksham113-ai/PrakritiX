import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
async function test(){
    try{
        console.log("Logging in as 113saksham@gmail.com...");
        const token=jwt.sign({id:1,email:'113saksham@gmail.com',name:'Saksham' },process.env.JWT_SECRET || "super-secret-jwt-key-for-demo",{expiresIn:"24h" });
        console.log("Fetching analytics... Token:",token);
        const res=await fetch('http://localhost:3000/api/analytics',{
            headers:{'Authorization':'Bearer ' +token}
        });
        console.log("Status:",res.status);
        const data=await res.json();
        console.log("Response:",JSON.stringify(data,null,2));
        const biogasRes=await fetch('http://localhost:3000/api/biogas/active',{
            headers:{'Authorization':'Bearer ' +token}
        });
        console.log("Biogas Status:",biogasRes.status);
        const biogasData=await biogasRes.json();
        console.log("Biogas Response:",JSON.stringify(biogasData,null,2));
    }catch(e){
        console.error(e);
    }
}
test();

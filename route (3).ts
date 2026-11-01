import {verifyPassword,sessionToken,json} from '@/lib/server';
import {cookies} from 'next/headers';
export async function POST(req:Request){const {email,password}=await req.json().catch(()=>({}));if(!process.env.ADMIN_PASSWORD_HASH||!process.env.SESSION_SECRET||email!==process.env.ADMIN_EMAIL||!verifyPassword(String(password||''),process.env.ADMIN_PASSWORD_HASH))return json({error:'بيانات الدخول غير صحيحة'},401);(await cookies()).set('zulfi_admin',sessionToken(),{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:28800});return json({ok:true})}

import {db,isAdmin,json} from '@/lib/server';
export async function POST(req:Request){if(!await isAdmin())return json({error:'غير مصرح'},401);const {mode}=await req.json();if(!['auto','open','closed'].includes(mode))return json({error:'وضع غير صالح'},400);const {error}=await db().from('booking_settings').update({mode}).eq('id',1);return error?json({error:'تعذر التعديل'},500):json({ok:true})}

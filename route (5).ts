import {db,isAdmin,json,monday} from '@/lib/server';
export const dynamic='force-dynamic';
export async function GET(req:Request){if(!await isAdmin())return json({error:'غير مصرح'},401);const week=new URL(req.url).searchParams.get('week')||monday();if(!/^\d{4}-\d{2}-\d{2}$/.test(week))return json({error:'تاريخ غير صالح'},400);const {data,error}=await db().from('bookings').select('id,week_date,number,full_name,phone,created_at,cancelled_at').eq('week_date',week).order('number');return error?json({error:'تعذر تحميل البيانات'},500):json({rows:data,week})}

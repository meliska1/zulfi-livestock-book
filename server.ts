import {createClient} from '@supabase/supabase-js';
import {DateTime} from 'luxon';
import {createHmac,timingSafeEqual,scryptSync,randomBytes} from 'node:crypto';
import {cookies} from 'next/headers';
export const db=()=>createClient(process.env.SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY!,{auth:{persistSession:false}});
export const now=()=>DateTime.now().setZone('Asia/Riyadh');
export function monday(){let d=now();return d.plus({days:(8-d.weekday)%7}).toISODate()!;}
export function windowOpen(){const d=now();return d.weekday===6||d.weekday===7||d.weekday===1&&d.hour<16;}
export function safePhone(s:string){let x=s.replace(/[\s-]/g,'');if(x.startsWith('+966'))x='0'+x.slice(4);else if(x.startsWith('966'))x='0'+x.slice(3);return /^05\d{8}$/.test(x)?x:null;}
export function hashPassword(p:string,salt?:string){const s=salt||randomBytes(16).toString('hex');return s+':'+scryptSync(p,s,64).toString('hex');}
export function verifyPassword(p:string,hash:string){const [salt]=hash.split(':');if(!salt)return false;const a=Buffer.from(hashPassword(p,salt).split(':')[1],'hex');const b=Buffer.from(hash.split(':')[1]||'','hex');return a.length===b.length&&timingSafeEqual(a,b);}
const sign=(v:string)=>createHmac('sha256',process.env.SESSION_SECRET!).update(v).digest('hex');
export function sessionToken(){const expiry=Date.now()+8*60*60*1000;const v=String(expiry);return v+'.'+sign(v);}
export async function isAdmin(){const token=(await cookies()).get('zulfi_admin')?.value||'';const [v,s]=token.split('.');if(!v||!s||Number(v)<Date.now()||!process.env.SESSION_SECRET)return false;const a=Buffer.from(sign(v),'hex'),b=Buffer.from(s,'hex');return a.length===b.length&&timingSafeEqual(a,b);}
export const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});

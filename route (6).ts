import {cookies} from 'next/headers';
export async function POST(){(await cookies()).delete('zulfi_admin');return Response.json({ok:true})}

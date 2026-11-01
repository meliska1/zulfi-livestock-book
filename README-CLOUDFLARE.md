# نشر Cloudflare Workers

هذه نسخة معدلة لعرض الأرقام المحجوزة مع إخفاء بيانات الحاجزين، ودعم بناء Next.js عبر OpenNext.

1. ارفع **محتويات** هذه النسخة إلى جذر مستودع GitHub نفسه (واستبدل الملفات المتكررة).
2. Cloudflare Workers > Settings > Build: Build command `npm run build`، Deploy command `npm run deploy` (أو `npx opennextjs-cloudflare build && npx opennextjs-cloudflare deploy`).
3. أضف متغيرات وأسرار التشغيل في Cloudflare Workers: `SUPABASE_URL`، `SUPABASE_SERVICE_ROLE_KEY`، `ADMIN_EMAIL`، `ADMIN_PASSWORD_HASH`، `SESSION_SECRET`؛ لا تضعها في GitHub.
4. انشر ثم اختبر صفحة الحجز والتزامن والحجز المكرر من جهازين. لا يعتبر الموقع جاهزاً للعامة قبل الاختبار.

تنبيه: حساب الإدارة ما زال محمياً بكلمة مرور مستقلة؛ الزبائن لا يحتاجون حساباً أو تسجيل دخول. واجهة الحجز تعرض الأرقام المحجوزة فقط، ولا تعرض أسماء أو جوالات الآخرين.

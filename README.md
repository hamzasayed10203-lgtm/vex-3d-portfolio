# VEX — Interactive 3D Portfolio (v1)

موقع بورتفوليو تفاعلي ثلاثي الأبعاد لـ **VEX — Video Editing Studio** (مونتاج ريلز).

An interactive 3D portfolio website for **VEX**, a reels/video editor. This is **v1 — أول نسخة**.

## المعروض حاليًا (What's real vs placeholder)

**Real:**
- الهوية والنصوص مأخوذة من موقع VEX الحالي (vex-portfolio-preview.vercel.app).
- قسم الأعمال فيه 3 ريلز حقيقية مضمّنة من فولدر Google Drive الخاص بالبورتفوليو.
- السعر الحقيقي: 450 ج.م للريل (أقل سعر 400 ج.م للباقات).
- زر الطلب بيفتح فورم جوجل الخاص باستقبال العملاء.

**Placeholder / للتطوير:**
- مفيش شعارات عملاء ولا آراء (testimonials) — متضافة عمدًا لحد ما تتجهز.
- صور الريلز بتشتغل من Google Drive embeds — الأفضل لاحقًا رفع نسخ مضغوطة على الموقع نفسه أو منصة فيديو.
- مفيش دومين مخصص لسه.

## التقنية (Stack)

- Static site: `index.html` + `styles.css` + `main.js` — مفيش build step.
- [Three.js](https://threejs.org) عبر CDN (import map) للمشهد ثلاثي الأبعاد في الـ hero:
  - 3 "فريمات ريلز" بتلف حوالين لوجو VEX ثلاثي الأبعاد.
  - حقل جزيئات (particles) بألوان البراند البنفسجي.
  - تفاعل: سحب بالماوس/الصباع لتدوير المشهد + parallax مع حركة المؤشر + drift مع الاسكرول.
- أداء الموبايل: تقليل عدد الجزيئات، cap للـ devicePixelRatio، تعطيل antialias على الموبايل.
- Fallback: لو الجهاز مفيهوش WebGL أو المستخدم مفعّل reduced-motion، بيظهر خلفية ثابتة أنيقة بدل المشهد المتحرك.
- الخط: Cairo من Google Fonts. الموقع عربي RTL بالكامل.

## التشغيل محليًا

لأن الموقع بيستخدم ES modules، افتحه بسيرفر محلي مش بفتح الملف مباشرة:

```bash
cd vex-3d-portfolio
python3 -m http.server 8080
# ثم افتح http://localhost:8080
```

## النشر (GitHub Pages)

الريبو متنشر على GitHub Pages من برانش `main` (المجلد الجذري `/`). أي push على `main` بيحدّث الموقع تلقائيًا خلال دقيقة تقريبًا.

Live: https://hamzasayed10203-lgtm.github.io/vex-3d-portfolio/

## إضافة شغل جديد

1. ارفع الفيديو على Google Drive وخلّي المشاركة "Anyone with the link".
2. خذ الـ FILE_ID من اللينك وحطّه في: `https://drive.google.com/file/d/FILE_ID/preview`
3. انسخ أي كارت من قسم `#work` في `index.html` وعدّل اللينك والعنوان. (فيه تعليق PLACEHOLDER بيوضح المكان.)

## ملاحظات v2 المحتملة

- استضافة الفيديوهات على منصة أسرع من Drive embeds.
- نسخة English toggle.
- دومين مخصص.
- ربط الفورم بإشعارات واتساب.

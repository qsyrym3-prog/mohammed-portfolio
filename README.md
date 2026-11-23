# محمد قصير | Mohammed Qasir — Portfolio

موقع بورتفوليو لمصور فوتوغرافي وصانع محتوى في جدة. عربي (RTL) + إنجليزي (LTR).

**التقنية:** [Astro](https://astro.build) (موقع ثابت) · Tailwind CSS v4 · PhotoSwipe (Lightbox) · النشر على Netlify.

> لإضافة مشاريع وتعديل النصوص شوف **[HOW-TO-ADD-WORK.md](HOW-TO-ADD-WORK.md)**.

---

## التشغيل على جهازك

تحتاج [Node.js](https://nodejs.org) نسخة 22.23 أو أحدث (مثبّتة عندك 26).

```powershell
npm install
```
```powershell
npm run dev
```

افتح http://localhost:4321، والإنجليزي على http://localhost:4321/en/

| الأمر | وش يسوي |
|---|---|
| `npm install` | يثبّت المكتبات (مرة وحدة، أو بعد ما تنسخ المشروع لجهاز ثاني) |
| `npm run dev` | يشغّل الموقع محليًا ويتحدّث مع كل حفظ |
| `npm run build` | يبني النسخة النهائية في مجلد `dist/` |
| `npm run preview` | يعرض النسخة النهائية محليًا |

---

## هيكل المشروع

```
src/
├── content/projects/     ← المشاريع: كل مجلد = مشروع (index.md + images/)
├── i18n/site.ts          ← كل نصوص الموقع بالعربي والإنجليزي + روابط التواصل
├── components/           ← أجزاء الصفحات (الهيدر، الغلاف، الأعمال، المعرض...)
├── layouts/BaseLayout    ← الإطار العام: SEO، الخطوط، الهيدر والفوتر
├── pages/                ← الصفحات: / ، /en/ ، /projects/[slug] ، /en/projects/[slug]
└── styles/global.css     ← الألوان والخطوط والهوية (القوس، الحبيبات...)
public/                   ← favicon، صورة المشاركة og.jpg، webmanifest
scripts/                  ← سكربتات مساعدة (تجهيز الصور، صورة المشاركة، سكرين شوت)
netlify.toml              ← إعدادات Netlify
```

### سكربتات مساعدة (اختيارية)
- `npm run prepare-assets`: ينسخ الصور المختارة من `source-assets` ويصغّرها، ويطلّع لقطات من الفيديوهات. يحتاج ffmpeg. انكتب مرة وحدة، وما تحتاجه للمشاريع الجديدة.
- `node scripts/make-brand-images.mjs`: يعيد توليد صورة المشاركة `og.jpg` والأيقونات (يستخدم متصفح Edge).
- `node scripts/screenshots.mjs / /en/`: يصوّر الصفحات بمقاس جوال وتابلت وديسكتوب في مجلد `screenshots/`. لازم يكون `npm run dev` أو `npm run preview` شغّال.

---

## النشر على Netlify (مجانًا) خطوة خطوة

### 1. سوّ حساب GitHub
من https://github.com/signup (إذا ما عندك حساب).

### 2. سوّ مستودع (Repository) جديد
1. ادخل https://github.com/new
2. **Repository name:** `mohammed-portfolio`
3. خلّه **Public** أو **Private**، الاثنين يشتغلون مع Netlify.
4. **لا** تحط علامة على *Add a README*، لأن المشروع فيه README.
5. اضغط **Create repository**، وانسخ الرابط اللي يطلع (مثل `https://github.com/USERNAME/mohammed-portfolio.git`).

### 3. ارفع المشروع
افتح PowerShell داخل مجلد المشروع، واكتب هالأوامر واحد واحد (بدّل الرابط برابطك):

```powershell
git remote add origin https://github.com/USERNAME/mohammed-portfolio.git
```
```powershell
git push -u origin main
```

أول مرة بتطلع لك نافذة تسجيل دخول GitHub. سجّل دخولك وخلاص.

### 4. اربط Netlify
1. ادخل https://app.netlify.com/signup وسجّل **بحساب GitHub** (أسهل شي).
2. اضغط **Add new project** ← **Import an existing project** ← **GitHub**.
3. اسمح لـ Netlify يوصل للمستودع `mohammed-portfolio` واختاره.
4. الإعدادات بتنعبّى تلقائيًا من `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. اضغط **Deploy**. بعد دقيقتين تقريبًا بيعطيك رابط مثل `https://random-name-123.netlify.app`.

### 5. غيّر اسم الرابط
**Project configuration** ← **Change project name** ← اكتب مثلًا `mohammed-qasir`، فيصير الرابط `https://mohammed-qasir.netlify.app`.

### 6. ⚠️ حدّث رابط الموقع في الكود
افتح `astro.config.mjs` وغيّر هالسطر للرابط الحقيقي:
```js
export const SITE_URL = 'https://mohammed-qasir.netlify.app';
```
بعدها ارفع التحديث (`git add .` ثم `git commit -m "site url"` ثم `git push`). هذا مهم عشان خريطة الموقع وصورة المشاركة في الواتساب تشتغل صح.

### 7. (اختياري) دومين خاص
إذا اشتريت دومين (مثل `mohammedqasir.com`): من Netlify ← **Domain management** ← **Add a domain** واتبع الخطوات. وبعدها حدّث `SITE_URL` مرة ثانية.

### 8. سجّل الموقع في جوجل (اختياري ومفيد)
1. ادخل https://search.google.com/search-console وأضف رابط موقعك.
2. من **Sitemaps** أضف: `sitemap-index.xml`

---

من هنا ورايح، أي `git push` يحدّث الموقع تلقائيًا خلال دقائق ✨

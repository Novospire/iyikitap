# iyikitap

İyi Kitap, listeler üzerinden editoryal keşif sunan bir affiliate okuma platformudur. Ürünümüz kitaplar değil, tematik listelerdir; her bölüm tam **5 kitap** içerir ve tüm çağrılar “Amazon’da Gör” CTA’sına yönlendirir.

## Quickstart

1. Bağımlılıkları kurun:

```bash
npm install
```

2. Ortam değişkenlerini hazırlayın:

```bash
cp .env.example .env
```

`.env` dosyasında aşağıdaki **zorunlu** değişkenler bulunur:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `AMAZON_ASSOCIATE_TAG`

3. Postgres’i başlatın:

```bash
docker compose up -d
```

4. Prisma şemasını uygulayın:

```bash
npm run prisma:migrate
```

5. Geliştirme sunucusunu çalıştırın:

```bash
npm run dev
```

6. Environment variables (required)

**Local**
- Create `.env` (you can copy from `.env.example`)
- Set `DATABASE_URL`
- Run:

```bash
npx prisma generate
# if you have pending migrations:
npx prisma migrate dev
```

**Preview / Production (Vercel)**
- Add `DATABASE_URL` to Vercel → Project Settings → Environment Variables
- If `DATABASE_URL` is missing, `/admin/import` will show **“Setup required”** instead of crashing.

## Demo: Google Books import

1. Admin import sayfasına gidin:

```
http://localhost:3000/admin/import
```

2. İsterseniz hedef bölümü belirtmek için `sectionId` parametresi ekleyin:

```
http://localhost:3000/admin/import?sectionId=<LIST_SECTION_ID>
```

3. Arama yapıp sonuçlardan 10–20 kitap seçerek mevcut liste bölümüne ekleyin.

## Editoryal kullanıcı oluşturma

NextAuth Credentials sağlayıcısı için kullanıcı kayıtları `User` tablosunda tutulur. Basit bir örnek akış:

```bash
node -e "const bcrypt=require('bcryptjs'); bcrypt.hash('parola', 10).then(hash => console.log(hash));"
```

Çıktıdaki hash’i kullanarak Prisma Studio veya SQL üzerinden bir kullanıcı ekleyin:

```sql
INSERT INTO "User" ("id", "email", "passwordHash", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'editor@iyikitap.com', '<HASH>', now(), now());
```

## Proje Yapısı

- `src/app` → Next.js App Router sayfaları
- `src/lib` → veri/kimlik doğrulama yardımcıları
- `prisma/schema.prisma` → listeler, bölümler, öğeler, kategoriler ve uzmanlıklar için veri modeli

## Notlar

- Site sadece editoryal listeler sunar; e-ticaret işlemi yoktur.
- Her bölümde tam 5 kitap olacak şekilde içerikler hazırlanır.
- Tüm ana CTA metni “Amazon’da Gör” olarak korunur.

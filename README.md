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
- `prisma/schema.prisma` → listeler, bölümler ve kitaplar için veri modeli

## Notlar

- Site sadece editoryal listeler sunar; e-ticaret işlemi yoktur.
- Her bölümde tam 5 kitap olacak şekilde içerikler hazırlanır.
- Tüm ana CTA metni “Amazon’da Gör” olarak korunur.

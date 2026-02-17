import { Prisma } from "@prisma/client";

import { prisma } from "../src/lib/prisma.ts";

const TOP_NAV_CATEGORY_NAMES = [
  "Edebiyat",
  "Düşünce",
  "Tarih",
  "Sanat",
  "Çocuk/Genç",
  "2025’in İyi Kitapları",
  "Dünya",
  "Kavramlar",
  "Gibi Kitaplar",
  "Kitaplardan Kitaplar",
  "Uzmanlar",
  "Kayıtlar",
  "Editör Masası",
] as const;

const FEATURED_CATEGORY_NAMES = [
  "Türk Romanı",
  "Dünya Romanı",
  "Doğu Kanonu",
  "Kültür Tarihi",
  "Sanat",
  "Tarih",
  "Psikoloji",
  "Batı Kanonu",
  "Bilim",
  "Tasavvuf",
  "2025’in En İyi Kitapları",
] as const;

const slugify = (value: string) =>
  value
    .toLocaleLowerCase("tr")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

type ItemInput = {
  asin: string;
  titleOverride: string;
  authorOverride: string;
  noteShort: string;
};

type ListInput = {
  title: string;
  slug: string;
  summary: string;
  theme: string;
  sectionTitle: string;
  sectionSummary: string;
  items: ItemInput[];
  expertId?: string;
};

const assertFiveItems = (list: ListInput) => {
  if (list.items.length !== 5) {
    throw new Error(`${list.title} must include exactly 5 items.`);
  }
};

const createListData = (list: ListInput): Prisma.ListCreateInput => {
  assertFiveItems(list);

  return {
    title: list.title,
    slug: list.slug,
    summary: list.summary,
    theme: list.theme,
    expert: list.expertId ? { connect: { id: list.expertId } } : undefined,
    sections: {
      create: {
        title: list.sectionTitle,
        summary: list.sectionSummary,
        order: 1,
        items: {
          create: list.items.map((item, index) => ({
            asin: item.asin,
            titleOverride: item.titleOverride,
            authorOverride: item.authorOverride,
            noteShort: item.noteShort,
            order: index + 1,
          })),
        },
      },
    },
  };
};

async function main() {
  await prisma.expertOnExpertiseCategory.deleteMany();
  await prisma.expertiseCategory.deleteMany();
  await prisma.listOnCategory.deleteMany();
  await prisma.listItem.deleteMany();
  await prisma.listSection.deleteMany();
  await prisma.list.deleteMany();
  await prisma.listCategory.deleteMany();
  await prisma.expert.deleteMany();

  const topNavRoot = await prisma.listCategory.create({
    data: { name: "Top Nav", slug: "top-nav" },
  });

  const featuredRoot = await prisma.listCategory.create({
    data: { name: "Featured Grid", slug: "featured-grid" },
  });

  await prisma.listCategory.createMany({
    data: TOP_NAV_CATEGORY_NAMES.map((name) => ({
      name,
      slug: slugify(`top-${name}`),
      parentId: topNavRoot.id,
    })),
  });

  await prisma.listCategory.createMany({
    data: FEATURED_CATEGORY_NAMES.map((name) => ({
      name,
      slug: slugify(`featured-${name}`),
      parentId: featuredRoot.id,
    })),
  });

  const experts = await Promise.all([
    prisma.expert.create({ data: { name: "Aykut Ertuğrul", title: "Öneriyor" } }),
    prisma.expert.create({ data: { name: "Güray Süngü", title: "Öneriyor" } }),
    prisma.expert.create({ data: { name: "Öner Türker", title: "Öneriyor" } }),
    prisma.expert.create({ data: { name: "Taha Kılınç", title: "Öneriyor" } }),
    prisma.expert.create({ data: { name: "Furkan Çalışkan", title: "Öneriyor" } }),
  ]);

  const lists: ListInput[] = [
    {
      title: "2025’in En Çok Satan Şair Türk Romanları",
      slug: "2025-en-cok-satan-sair-turk-romanlari",
      summary: "Son dönemde öne çıkan romanlardan seçilen röportaj listesi.",
      theme: "interview",
      expertId: experts[0].id,
      sectionTitle: "Seçki",
      sectionSummary: "Röportajdan öne çıkan kitaplar.",
      items: [
        { asin: "9786051111111", titleOverride: "Saatleri Ayarlama Enstitüsü", authorOverride: "Ahmet Hamdi Tanpınar", noteShort: "Modernleşme sancılarını mizahla işler." },
        { asin: "9786051111112", titleOverride: "Tutunamayanlar", authorOverride: "Oğuz Atay", noteShort: "Türk romanında kırılma yaratan metin." },
        { asin: "9786051111113", titleOverride: "Kürk Mantolu Madonna", authorOverride: "Sabahattin Ali", noteShort: "Aşk ve yalnızlık anlatısı." },
        { asin: "9786051111114", titleOverride: "Huzur", authorOverride: "Ahmet Hamdi Tanpınar", noteShort: "İstanbul merkezli bir iç dünya romanı." },
        { asin: "9786051111115", titleOverride: "Aylak Adam", authorOverride: "Yusuf Atılgan", noteShort: "Kentte yabancılaşma temasını taşır." },
      ],
    },
    {
      title: "Bir Sahafta Rast Gelinen 5 Kitap",
      slug: "bir-sahafta-rast-gelinan-5-kitap",
      summary: "Sahaf raflarından çıkan kitaplarla kısa bir okuma güzergâhı.",
      theme: "interview",
      expertId: experts[1].id,
      sectionTitle: "Sahaf Seçkisi",
      sectionSummary: "Sahaflarda sık karşılaşılmayan öneriler.",
      items: [
        { asin: "9786051111116", titleOverride: "Anayurt Oteli", authorOverride: "Yusuf Atılgan", noteShort: "Sıkışmış bir hayatın tekinsizliği." },
        { asin: "9786051111117", titleOverride: "Yaban", authorOverride: "Yakup Kadri Karaosmanoğlu", noteShort: "Aydın-halk çatışmasını tartışır." },
        { asin: "9786051111118", titleOverride: "Puslu Kıtalar Atlası", authorOverride: "İhsan Oktay Anar", noteShort: "Kurgu gücü yüksek postmodern roman." },
        { asin: "9786051111119", titleOverride: "Sinekli Bakkal", authorOverride: "Halide Edib Adıvar", noteShort: "Toplumsal değişimin romanı." },
        { asin: "9786051111120", titleOverride: "İnce Memed", authorOverride: "Yaşar Kemal", noteShort: "Anadolu anlatısının güçlü örneği." },
      ],
    },
    {
      title: "En Çok Tavsiye Edilen İyi Kitaplar I",
      slug: "en-cok-tavsiye-edilen-iyi-kitaplar-1",
      summary: "Okur topluluğunda en çok tavsiye edilen seçki.",
      theme: "top_recommended",
      sectionTitle: "Öne Çıkanlar",
      sectionSummary: "En yüksek öneri alan kitaplar.",
      items: [
        { asin: "9786051111121", titleOverride: "Körlük", authorOverride: "Jose Saramago", noteShort: "İnsan doğasını sert bir alegoriyle anlatır." },
        { asin: "9786051111122", titleOverride: "Sefiller", authorOverride: "Victor Hugo", noteShort: "Adalet ve merhamet üzerine klasik." },
        { asin: "9786051111123", titleOverride: "Dönüşüm", authorOverride: "Franz Kafka", noteShort: "Yabancılaşmanın kısa ve etkili anlatısı." },
        { asin: "9786051111124", titleOverride: "Suç ve Ceza", authorOverride: "Fyodor Dostoyevski", noteShort: "Vicdan ve ahlak ikilemleri." },
        { asin: "9786051111125", titleOverride: "1984", authorOverride: "George Orwell", noteShort: "Gözetim toplumu eleştirisi." },
      ],
    },
    {
      title: "En Çok Tavsiye Edilen İyi Kitaplar II",
      slug: "en-cok-tavsiye-edilen-iyi-kitaplar-2",
      summary: "Tavsiyesi en yüksek bir diğer seçki.",
      theme: "top_recommended",
      sectionTitle: "Devam",
      sectionSummary: "Ek öneriler.",
      items: [
        { asin: "9786051111126", titleOverride: "Karamazov Kardeşler", authorOverride: "Fyodor Dostoyevski", noteShort: "İnanç, ahlak ve aile ilişkileri." },
        { asin: "9786051111127", titleOverride: "Yüzyıllık Yalnızlık", authorOverride: "Gabriel García Márquez", noteShort: "Büyülü gerçekçiliğin başyapıtı." },
        { asin: "9786051111128", titleOverride: "Savaş ve Barış", authorOverride: "Lev Tolstoy", noteShort: "Tarih ve birey ilişkisine derin bakış." },
        { asin: "9786051111129", titleOverride: "Beyaz Geceler", authorOverride: "Fyodor Dostoyevski", noteShort: "Kısa ama etkileyici bir anlatı." },
        { asin: "9786051111130", titleOverride: "Dava", authorOverride: "Franz Kafka", noteShort: "Bürokrasi ve anlamsızlık hissi." },
      ],
    },
    {
      title: "Gibi Kitaplar: Japon Edebiyatı",
      slug: "gibi-kitaplar-japon-edebiyati",
      summary: "Japon edebiyatını sevenler için benzer okumalar.",
      theme: "similar_books",
      sectionTitle: "Benzer Kitaplar",
      sectionSummary: "Aynı damarda ilerleyen kitaplar.",
      items: [
        { asin: "9786051111131", titleOverride: "Japon Mitolojisi", authorOverride: "Kolektif", noteShort: "Mitolojik kaynaklara giriş niteliğinde." },
        { asin: "9786051111132", titleOverride: "Japonca Çok Öyküler", authorOverride: "Güray Süngü", noteShort: "Seçme kısa öyküler derlemesi." },
        { asin: "9786051111133", titleOverride: "Japon Edebiyatının Zevki", authorOverride: "Denal Kemal", noteShort: "Edebiyat tarihi perspektifi sunar." },
        { asin: "9786051111134", titleOverride: "Kokoro", authorOverride: "Natsume Sōseki", noteShort: "Modern Japon ruhuna odaklanır." },
        { asin: "9786051111135", titleOverride: "Norveç Ormanı", authorOverride: "Haruki Murakami", noteShort: "Duygusal tonuyla öne çıkar." },
      ],
    },
    {
      title: "Zaman Kavramını Anlamak İçin 5 Kitap",
      slug: "zaman-kavramini-anlamak-icin-5-kitap",
      summary: "Zaman fikrini farklı yönlerden ele alan başlangıç listesi.",
      theme: "reading_list",
      sectionTitle: "Zaman",
      sectionSummary: "Felsefe, bilim ve anlatı düzleminde zaman.",
      items: [
        { asin: "9786051111136", titleOverride: "Zaman Yolculuğu", authorOverride: "James Gleick", noteShort: "Popüler bilim ekseninde zaman." },
        { asin: "9786051111137", titleOverride: "Zamanın Coğrafyası", authorOverride: "Denis Wood", noteShort: "Mekân-zaman ilişkisini işler." },
        { asin: "9786051111138", titleOverride: "Zaman Üzerine", authorOverride: "David Harvey", noteShort: "Toplumsal teori bağlantıları kurar." },
        { asin: "9786051111139", titleOverride: "Kopernik’ten Einstein’a", authorOverride: "Luca V. Albert", noteShort: "Bilim tarihi üzerinden zaman." },
        { asin: "9786051111140", titleOverride: "Varlık ve Zaman", authorOverride: "Martin Heidegger", noteShort: "Felsefi temel metin." },
      ],
    },
    {
      title: "Şehir ve Hafıza Okumaları",
      slug: "sehir-ve-hafiza-okumalari",
      summary: "Şehir hafızasını edebiyat ve düşünce üzerinden okumak için.",
      theme: "reading_list",
      sectionTitle: "Şehir",
      sectionSummary: "Kent, mekân ve belleğe odaklanan eserler.",
      items: [
        { asin: "9786051111141", titleOverride: "İstanbul: Hatıralar ve Şehir", authorOverride: "Orhan Pamuk", noteShort: "Kişisel ve kültürel şehir hafızası." },
        { asin: "9786051111142", titleOverride: "Pasajlar", authorOverride: "Walter Benjamin", noteShort: "Modern kentin düşünsel atlası." },
        { asin: "9786051111143", titleOverride: "Mekânın Poetikası", authorOverride: "Gaston Bachelard", noteShort: "Mekân deneyimini şiirsel yorumlar." },
        { asin: "9786051111144", titleOverride: "Görünmez Kentler", authorOverride: "Italo Calvino", noteShort: "Hayali şehirler üzerinden düşünce." },
        { asin: "9786051111145", titleOverride: "Şehir ve Kültür", authorOverride: "Lewis Mumford", noteShort: "Kent tarihine geniş bakış." },
      ],
    },
    {
      title: "Modern Türk Şiiri İçin Başlangıç",
      slug: "modern-turk-siiri-icin-baslangic",
      summary: "Modern Türk şiirinin ana damarlarını takip eden bir başlangıç listesi.",
      theme: "reading_list",
      sectionTitle: "Şiir",
      sectionSummary: "Cumhuriyet dönemi şiirinden seçkiler.",
      items: [
        { asin: "9786051111146", titleOverride: "Bütün Şiirleri", authorOverride: "Orhan Veli Kanık", noteShort: "Garip şiirinin merkez metni." },
        { asin: "9786051111147", titleOverride: "Sevda Sözleri", authorOverride: "Cemal Süreya", noteShort: "İkinci Yeni’nin önemli sesi." },
        { asin: "9786051111148", titleOverride: "Çile", authorOverride: "Necip Fazıl Kısakürek", noteShort: "Felsefi ve mistik şiirler." },
        { asin: "9786051111149", titleOverride: "Dünyanın En Güzel Arabistanı", authorOverride: "Turgut Uyar", noteShort: "Dilin sınırlarını zorlayan bir ses." },
        { asin: "9786051111150", titleOverride: "Karanfil ve Pranga", authorOverride: "Edip Cansever", noteShort: "Yoğun imgesel yapı." },
      ],
    },
  ];

  for (const list of lists) {
    await prisma.list.create({ data: createListData(list) });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

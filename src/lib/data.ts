const ITEMS_PER_SECTION = 5;
const ITEM_ORDER_MIN = 1;
const ITEM_ORDER_MAX = 5;

const AMAZON_ASSOCIATE_TAG = process.env.AMAZON_ASSOCIATE_TAG;

if (!AMAZON_ASSOCIATE_TAG) {
  throw new Error("AMAZON_ASSOCIATE_TAG is required.");
}

export type ListItem = {
  asin: string;
  titleOverride?: string;
  authorOverride?: string;
  noteShort?: string;
  noteLong?: string;
  order: number;
};

export type ListSection = {
  title: string;
  summary: string;
  order: number;
  items: ListItem[];
};

export type List = {
  title: string;
  summary: string;
  theme: string;
  sections: ListSection[];
};

export const buildAmazonLink = (asin: string) => {
  const baseUrl = `https://www.amazon.com.tr/dp/${asin}`;

  return `${baseUrl}?tag=${AMAZON_ASSOCIATE_TAG}`;
};

const assertSectionHasFiveItems = (section: ListSection) => {
  if (section.items.length !== ITEMS_PER_SECTION) {
    throw new Error(
      `List section "${section.title}" must have exactly ${ITEMS_PER_SECTION} items.`,
    );
  }

  const orders = new Set(section.items.map((item) => item.order));

  if (orders.size !== ITEMS_PER_SECTION) {
    throw new Error(
      `List section "${section.title}" must use unique item orders 1-5.`,
    );
  }

  section.items.forEach((item) => {
    if (item.order < ITEM_ORDER_MIN || item.order > ITEM_ORDER_MAX) {
      throw new Error(
        `List item "${item.asin}" must have order between ${ITEM_ORDER_MIN} and ${ITEM_ORDER_MAX}.`,
      );
    }
  });
};

const assertListsAreValid = (candidateLists: List[]) => {
  candidateLists.forEach((list) => {
    list.sections.forEach((section) => {
      assertSectionHasFiveItems(section);
    });
  });
};

export const lists: List[] = [
  {
    title: "2024'te Odaklanma Ustaları",
    summary:
      "Dikkat ekonomisinde üretkenliği ve derin düşünmeyi güçlendiren beşer kitaplık bölümler.",
    theme: "Zihin açıklığı ve akış",
    sections: [
      {
        title: "Derin çalışma ritüelleri",
        summary:
          "Kalıcı alışkanlıklar kurmak için bilimsel ve pratik yaklaşımlar.",
        order: 1,
        items: [
          {
            asin: "B00XW5WJ8Y",
            titleOverride: "Deep Work",
            authorOverride: "Cal Newport",
            noteShort: "Kesintisiz odak için stratejiler.",
            noteLong: "Uzun odak bloklarıyla kaliteli üretime geçiş rehberi.",
            order: 1,
          },
          {
            asin: "B01N5AX61W",
            titleOverride: "Atomic Habits",
            authorOverride: "James Clear",
            noteShort: "Küçük alışkanlıkları sistemlere dönüştürün.",
            noteLong: "Günlük mikro alışkanlıklarla sürdürülebilir gelişim.",
            order: 2,
          },
          {
            asin: "B00EMHACRU",
            titleOverride: "The One Thing",
            authorOverride: "Gary Keller & Jay Papasan",
            noteShort: "Önceliklendirme ile sonuç odaklı ilerleme.",
            noteLong: "Tek kritik hedefe odaklanarak verimi artırma.",
            order: 3,
          },
          {
            asin: "B00G1J1D28",
            titleOverride: "Essentialism",
            authorOverride: "Greg McKeown",
            noteShort: "Gereksiz yüklerden arınmış üretkenlik.",
            noteLong: "Az ama etkili görevlerle enerjiyi koruma.",
            order: 4,
          },
          {
            asin: "B01M2YX1AC",
            titleOverride: "Make Time",
            authorOverride: "Jake Knapp & John Zeratsky",
            noteShort: "Günlük odak bloklarıyla zaman yönetimi.",
            noteLong: "Dikkati dağıtan unsurları filtreleyen pratikler.",
            order: 5,
          },
        ],
      },
      {
        title: "Yaratıcı enerji ve ilham",
        summary:
          "Çalışma rutinine ilham katmak isteyenler için yaratıcı düşünme kaynakları.",
        order: 2,
        items: [
          {
            asin: "B0074QGGK6",
            titleOverride: "Steal Like an Artist",
            authorOverride: "Austin Kleon",
            noteShort: "Yaratıcı üretimde etik ve esinlenme.",
            noteLong: "İlhamı yakalayıp özgün üretime dönüştürme.",
            order: 1,
          },
          {
            asin: "B00E257T6C",
            titleOverride: "Show Your Work!",
            authorOverride: "Austin Kleon",
            noteShort: "Üretimini paylaşmak için yöntemler.",
            noteLong: "Görünürlük ve paylaşım pratikleriyle etki yaratma.",
            order: 2,
          },
          {
            asin: "B00FJEYHI8",
            titleOverride: "Creative Confidence",
            authorOverride: "Tom Kelley & David Kelley",
            noteShort: "Yaratıcılığı günlük kas gibi güçlendirme.",
            noteLong: "Deneysel düşünceyle risk almaya teşvik.",
            order: 3,
          },
          {
            asin: "B00DPM7TIG",
            titleOverride: "The War of Art",
            authorOverride: "Steven Pressfield",
            noteShort: "Dirençle baş etmek için yaratıcı disiplin.",
            noteLong: "Üretkenliği baltalayan iç dirence karşı stratejiler.",
            order: 4,
          },
          {
            asin: "B00J2JYPBS",
            titleOverride: "Big Magic",
            authorOverride: "Elizabeth Gilbert",
            noteShort: "Yaratıcı cesareti canlı tutma.",
            noteLong: "Üretimde merak ve cesaretle ilerleme rehberi.",
            order: 5,
          },
        ],
      },
    ],
  },
  {
    title: "Liderlikte İnsan Odaklılık",
    summary:
      "Takım yönetiminde empati ve stratejiyi birleştiren seçkiler.",
    theme: "Liderlik ve kültür",
    sections: [
      {
        title: "Empatik liderlik",
        summary:
          "İnsan ilişkilerinde güven ve netlik kurmak isteyen yöneticilere.",
        order: 1,
        items: [
          {
            asin: "B06XQ6XKCH",
            titleOverride: "Dare to Lead",
            authorOverride: "Brené Brown",
            noteShort: "Cesur liderlik ve kırılganlık yönetimi.",
            noteLong: "Empati temelli güven kültürü için rehber.",
            order: 1,
          },
          {
            asin: "B01ARSCF9A",
            titleOverride: "The Culture Code",
            authorOverride: "Daniel Coyle",
            noteShort: "Yüksek performanslı ekiplerin kültür kodları.",
            noteLong: "Aidiyet ve güveni artıran davranışlar.",
            order: 2,
          },
          {
            asin: "B00HG0P3CE",
            titleOverride: "Leaders Eat Last",
            authorOverride: "Simon Sinek",
            noteShort: "Güven ve aidiyet oluşturma üzerine.",
            noteLong: "Takım bağlılığı için liderlik kasları.",
            order: 3,
          },
          {
            asin: "B01N0QZQ1A",
            titleOverride: "Radical Candor",
            authorOverride: "Kim Scott",
            noteShort: "Dürüst geri bildirim ile güven kurma.",
            noteLong: "Açık iletişimle performans kültürü inşası.",
            order: 4,
          },
          {
            asin: "B00BHEB9EQ",
            titleOverride: "Multipliers",
            authorOverride: "Liz Wiseman",
            noteShort: "Yetenekleri büyüten liderlik modelleri.",
            noteLong: "Takımın kapasitesini büyüten lider profili.",
            order: 5,
          },
        ],
      },
      {
        title: "Stratejik yön",
        summary:
          "Net yön belirlemek ve paydaşları hizalamak isteyen liderlere.",
        order: 2,
        items: [
          {
            asin: "B005J4XKBE",
            titleOverride: "Good Strategy Bad Strategy",
            authorOverride: "Richard Rumelt",
            noteShort: "Net strateji çerçeveleri ve vaka örnekleri.",
            noteLong: "Stratejik kararları basitleştiren yaklaşım.",
            order: 1,
          },
          {
            asin: "B074SX9WLC",
            titleOverride: "Measure What Matters",
            authorOverride: "John Doerr",
            noteShort: "OKR yaklaşımıyla hedeflere odaklanma.",
            noteLong: "Hedef hizalaması için ölçülebilir sistemler.",
            order: 2,
          },
          {
            asin: "B00G3L1A7S",
            titleOverride: "Playing to Win",
            authorOverride: "A.G. Lafley & Roger Martin",
            noteShort: "Rekabet avantajı yaratma yolları.",
            noteLong: "Pazar oyun planını netleştiren stratejiler.",
            order: 3,
          },
          {
            asin: "B00G4LGR08",
            titleOverride: "The Advantage",
            authorOverride: "Patrick Lencioni",
            noteShort: "Organizasyonel sağlık üzerine liderlik rehberi.",
            noteLong: "Sağlıklı kültürün performansa etkisi.",
            order: 4,
          },
          {
            asin: "B00DQ845EA",
            titleOverride: "High Output Management",
            authorOverride: "Andrew S. Grove",
            noteShort: "Operasyonel yönetim pratiği ve metrikler.",
            noteLong: "Performans takibini güçlendiren yönetim anlayışı.",
            order: 5,
          },
        ],
      },
    ],
  },
];

assertListsAreValid(lists);

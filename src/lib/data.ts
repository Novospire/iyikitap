export type Book = {
  title: string;
  author: string;
  description: string;
  amazonUrl: string;
};

export type Section = {
  title: string;
  description: string;
  books: Book[];
};

export type List = {
  title: string;
  summary: string;
  theme: string;
  sections: Section[];
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
        description:
          "Kalıcı alışkanlıklar kurmak için bilimsel ve pratik yaklaşımlar.",
        books: [
          {
            title: "Deep Work",
            author: "Cal Newport",
            description: "Kesintisiz odak için stratejiler ve çalışma ritüelleri.",
            amazonUrl: "https://www.amazon.com/",
          },
          {
            title: "Atomic Habits",
            author: "James Clear",
            description: "Küçük alışkanlıkları sürdürülebilir sistemlere dönüştürme.",
            amazonUrl: "https://www.amazon.com/",
          },
          {
            title: "The One Thing",
            author: "Gary Keller & Jay Papasan",
            description: "Önceliklendirme ile sonuç odaklı ilerleme.",
            amazonUrl: "https://www.amazon.com/",
          },
          {
            title: "Essentialism",
            author: "Greg McKeown",
            description: "Gereksiz yüklerden arınmış üretkenlik.",
            amazonUrl: "https://www.amazon.com/",
          },
          {
            title: "Make Time",
            author: "Jake Knapp & John Zeratsky",
            description: "Günlük odak bloklarıyla zaman yönetimi.",
            amazonUrl: "https://www.amazon.com/",
          },
        ],
      },
      {
        title: "Yaratıcı enerji ve ilham",
        description:
          "Çalışma rutinine ilham katmak isteyenler için yaratıcı düşünme kaynakları.",
        books: [
          {
            title: "Steal Like an Artist",
            author: "Austin Kleon",
            description: "Yaratıcı üretimde etik ve esinlenme.",
            amazonUrl: "https://www.amazon.com/",
          },
          {
            title: "Show Your Work!",
            author: "Austin Kleon",
            description: "Üretimini paylaşmak ve görünür kılmak için yöntemler.",
            amazonUrl: "https://www.amazon.com/",
          },
          {
            title: "Creative Confidence",
            author: "Tom Kelley & David Kelley",
            description: "Yaratıcılığı günlük bir kas gibi güçlendirme.",
            amazonUrl: "https://www.amazon.com/",
          },
          {
            title: "The War of Art",
            author: "Steven Pressfield",
            description: "Dirençle baş etmek için yaratıcı disiplin.",
            amazonUrl: "https://www.amazon.com/",
          },
          {
            title: "Big Magic",
            author: "Elizabeth Gilbert",
            description: "Yaratıcı cesareti canlı tutma.",
            amazonUrl: "https://www.amazon.com/",
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
        description:
          "İnsan ilişkilerinde güven ve netlik kurmak isteyen yöneticilere.",
        books: [
          {
            title: "Dare to Lead",
            author: "Brené Brown",
            description: "Cesur liderlik ve kırılganlık yönetimi.",
            amazonUrl: "https://www.amazon.com/",
          },
          {
            title: "The Culture Code",
            author: "Daniel Coyle",
            description: "Yüksek performanslı ekiplerin kültür kodları.",
            amazonUrl: "https://www.amazon.com/",
          },
          {
            title: "Leaders Eat Last",
            author: "Simon Sinek",
            description: "Güven ve aidiyet oluşturma üzerine.",
            amazonUrl: "https://www.amazon.com/",
          },
          {
            title: "Radical Candor",
            author: "Kim Scott",
            description: "Dürüst geri bildirim ile güven kurma.",
            amazonUrl: "https://www.amazon.com/",
          },
          {
            title: "Multipliers",
            author: "Liz Wiseman",
            description: "Yetenekleri büyüten liderlik modelleri.",
            amazonUrl: "https://www.amazon.com/",
          },
        ],
      },
      {
        title: "Stratejik yön",
        description:
          "Net yön belirlemek ve paydaşları hizalamak isteyen liderlere.",
        books: [
          {
            title: "Good Strategy Bad Strategy",
            author: "Richard Rumelt",
            description: "Net strateji çerçeveleri ve vaka örnekleri.",
            amazonUrl: "https://www.amazon.com/",
          },
          {
            title: "Measure What Matters",
            author: "John Doerr",
            description: "OKR yaklaşımıyla hedeflere odaklanma.",
            amazonUrl: "https://www.amazon.com/",
          },
          {
            title: "Playing to Win",
            author: "A.G. Lafley & Roger Martin",
            description: "Rekabet avantajı yaratma yolları.",
            amazonUrl: "https://www.amazon.com/",
          },
          {
            title: "The Advantage",
            author: "Patrick Lencioni",
            description: "Organizasyonel sağlık üzerine liderlik rehberi.",
            amazonUrl: "https://www.amazon.com/",
          },
          {
            title: "High Output Management",
            author: "Andrew S. Grove",
            description: "Operasyonel yönetim pratiği ve metrikler.",
            amazonUrl: "https://www.amazon.com/",
          },
        ],
      },
    ],
  },
];

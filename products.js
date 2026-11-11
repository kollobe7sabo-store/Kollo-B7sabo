// ============================================================
//  إعدادات الستور + قائمة المنتجات
//  ده الملف الوحيد اللي هتعدل فيه غالباً (أسعار، منتجات، رقم...)
// ============================================================

const STORE = {
  comingSoon: true,                // true = الموقع كله بيعرض صفحة "قريباً" بس. يوم الافتتاح اكتب false
  name: "كله بحسابو",               // اسم الستور (Kollo)
  whatsapp: "201507656275",        // الرقم بالصيغة الدولية من غير + ولا صفر
  instagram: "https://www.instagram.com/kollobe7saboo?cplk=Y3FvcXRwY3o4dWFu",                   // حط لينك صفحة إنستجرام هنا بين علامتي التنصيص
  facebook: "https://www.facebook.com/share/1HofaqrNYK/",                    // حط لينك صفحة فيسبوك هنا بين علامتي التنصيص
  city: "أسيوط",
  deliveryFee: 20,                 // رسوم التوصيل العادية بالجنيه (هي كمان رسوم اليوم الأول في سلسلة الطلبات)
  freeDeliveryFrom: 500,           // التوصيل مجاني لو الطلب وصل للمبلغ ده (0 = مفيش توصيل مجاني)
  workingHours: "يومياً من 10 صباحاً حتى 10 مساءً",

  // بيانات الدفع الإلكتروني (حط أرقامك الحقيقية هنا)
  wallet: { label: "المحفظة الإلكترونية", number: "01151160642" },
  instapay: { label: "InstaPay", handle: "01151160642" },

  // مناطق التوصيل (عدّلها زي ما تحب)
  areas: [
    "وسط البلد",
    "الوليدية",
    "الزهراء",
    "حي الجامعة",
    "المدينة الجامعية بنات",     // لازم الاسم يطابق اللي في FREE_SLOTS تحت
    "المدينة الجامعية شباب",
    "الأربعين",
    "السادات",
    "ناصر",
    "منطقة تانية (هنتفق على التوصيل)"
  ]
};

// لإخفاء تصنيف مؤقتاً: زوّد hidden: true جواه (والمنتجات بتاعته بتختفي كمان). عشان يرجع شيل hidden: true
// التصنيفات
const CATEGORIES = [
  { id: "all", name: "الكل", icon: "sparkle" },
  { id: "notebooks", name: "كشاكيل", icon: "notebook" },
  { id: "planners", name: "مذكرات", icon: "planner" },
  { id: "perfumes", name: "عطور", icon: "perfume" },
  { id: "bags", name: "شنط", icon: "bag" },
  { id: "clothes", name: "ملابس", icon: "shirt" },
  { id: "beauty", name: "عناية وجمال", icon: "drop" },
  { id: "cleaning", name: "المنظفات", icon: "spray" },
  { id: "fatafeet", name: "كله بالفتفوتة", icon: "candy" }
];

// المنتجات
//  image:    صورة الكارت الرئيسية، مثلاً "images/notebook1.jpg" (سيبها "" ويظهر الإيموجي)
//  images:   صور صفحة التفاصيل (معرض الصور)، مثلاً ["images/n1-a.jpg", "images/n1-b.jpg"]
//            لو سيبتها [] هتتعرض image بس، ولو مفيش صور خالص يظهر الإيموجي
//  details:  وصف طويل بيظهر في صفحة التفاصيل
//  features: نقاط مميزات (قايمة نقاط)
//  specs:    مواصفات على شكل [الاسم, القيمة]
//  sizes:    (اختياري) مقاسات المنتج، مثلاً ["M", "L", "XL"]. لو سيبتها مش موجودة مفيش اختيار مقاس
//  vendor:   (اختياري) اسم المورّد اللي بتبيع منتجاته، مثلاً "العبدلله"
//  badge:    شارة اختيارية زي "جديد" أو "خصم"
//  oldPrice: السعر القديم (اختياري) لعرض الخصم
//  inStock:  false لو المنتج خلص
//  (التفاصيل والمواصفات تحت أمثلة، بدّلها ببيانات منتجاتك الحقيقية)
const PRODUCTS = [
  {
    id: 11, category: "clothes", vendor: "العبدلله", sizes: ["M", "L", "XL", "XXL"], name: "هودي أسود بطبعة سلوجان",
    price: 550, oldPrice: 0, emoji: "🧥", image: "images/hoodie-slogan-black.jpg", images: ["images/hoodie-slogan-black.jpg"], badge: "", inStock: true,
    desc: "هودي أسود بطبعة جريئة على الصدر وجيب كنغر أمامي.",
    details: "هودي أسود بكابوشون وطبعة سلوجان إنجليزي بألوان الأبيض والأخضر مع رسمة سيفين متقاطعين على الصدر. قصة واسعة مريحة ومناسبة لجو الشتا واللبس اليومي.",
    features: ["كابوشون بخيوط ربط", "طبعة سلوجان على الصدر", "جيب كنغر أمامي", "أساور ريب عند الأكمام والوسط"],
    specs: [["اللون", "أسود"], ["النوع", "هودي"]]
  },
  {
    id: 12, category: "clothes", vendor: "العبدلله", sizes: ["M", "L", "XL", "XXL"], name: "هودي رمادي فاتح بطبعة سلوجان",
    price: 550, oldPrice: 0, emoji: "🧥", image: "images/hoodie-slogan-gray.jpg", images: ["images/hoodie-slogan-gray.jpg"], badge: "", inStock: true,
    desc: "نفس تصميم السلوجان بلون رمادي فاتح هادي وعملي.",
    details: "هودي رمادي فاتح بنفس طبعة السلوجان والسيفين المتقاطعين، بس بألوان البني والأسود. لون هادي بيمشي مع أي حاجة وبيناسب الخروج والجامعة.",
    features: ["كابوشون بخيوط ربط", "طبعة سلوجان على الصدر", "جيب كنغر أمامي", "أساور ريب عند الأكمام والوسط"],
    specs: [["اللون", "رمادي فاتح"], ["النوع", "هودي"]]
  },
  {
    id: 13, category: "clothes", vendor: "العبدلله", sizes: ["M", "L", "XL", "XXL"], name: "هودي أسود بتطريز على الصدر",
    price: 500, oldPrice: 580, emoji: "🧥", image: "images/hoodie-embroidered-black.jpg", images: ["images/hoodie-embroidered-black.jpg"], badge: "خصم", inStock: true,
    desc: "هودي أسود كلاسيك بتطريز أبيض وأحمر على الصدر.",
    details: "هودي أسود بقصة واسعة وتطريز بارز على الصدر بالأبيض والأحمر مع شريط ملوّن صغير. بسيط وأنيق ومناسب لكل يوم.",
    features: ["تطريز على الصدر", "كابوشون بخيوط ربط بأطراف معدن", "جيب كنغر أمامي", "قصة واسعة مريحة"],
    specs: [["اللون", "أسود"], ["النوع", "هودي"]]
  },
  {
    id: 14, category: "clothes", vendor: "العبدلله", sizes: ["M", "L", "XL", "XXL"], name: "هودي أخضر بترولي بطبعة",
    price: 550, oldPrice: 0, emoji: "🧥", image: "images/hoodie-print-teal.jpg", images: ["images/hoodie-print-teal.jpg"], badge: "", inStock: true,
    desc: "لون أخضر بترولي مميز وطبعة بيضاء فنية في النص.",
    details: "هودي بلون أخضر بترولي غامق وطبعة بيضاء بتصميم فني (إيدين وعين) في منتصف الصدر. بطانة داخلية ناعمة في الكابوشون ولون مختلف عن الأسود المعتاد.",
    features: ["لون أخضر بترولي مميز", "طبعة بيضاء في منتصف الصدر", "جيب كنغر أمامي", "أساور ريب عند الأكمام والوسط"],
    specs: [["اللون", "أخضر بترولي"], ["النوع", "هودي"]]
  },
  {
    id: 15, category: "clothes", vendor: "العبدلله", sizes: ["M", "L", "XL", "XXL"], name: "هودي أحمر بطبعة",
    price: 550, oldPrice: 0, emoji: "🧥", image: "images/hoodie-print-red.jpg", images: ["images/hoodie-print-red.jpg"], badge: "جديد", inStock: true,
    desc: "هودي أحمر لافت بطبعة سودا في منتصف الصدر.",
    details: "هودي أحمر زاهي بطبعة سودا بتصميم فني (إيدين وعين) في منتصف الصدر. لون جريء للي بيحب يبان.",
    features: ["لون أحمر لافت", "طبعة سودا في منتصف الصدر", "جيب كنغر أمامي", "كابوشون بخيوط ربط سودا"],
    specs: [["اللون", "أحمر"], ["النوع", "هودي"]]
  },
  {
    id: 16, category: "clothes", vendor: "العبدلله", sizes: ["M", "L", "XL", "XXL"], name: "هودي زيب أسود بطبعة جرافيتي",
    price: 600, oldPrice: 0, emoji: "🧥", image: "images/zip-hoodie-graffiti-black.jpg", images: ["images/zip-hoodie-graffiti-black.jpg"], badge: "جديد", inStock: true,
    desc: "هودي بسوستة كاملة وطباعة جرافيتي بيضاء على الصدر والأكمام.",
    details: "هودي أسود بسوستة معدنية كاملة وطباعة جرافيتي بيضاء كبيرة على الصدر وعلى الكُمّين. ستايل ستريت واضح وبيلفت النظر.",
    features: ["سوستة معدنية كاملة في المقدمة", "طباعة جرافيتي على الصدر والكمين", "جيبين أمامين", "كابوشون بخيوط ربط"],
    specs: [["اللون", "أسود"], ["النوع", "هودي بسوستة"]]
  },
  {
    id: 17, category: "clothes", vendor: "العبدلله", sizes: ["M", "L", "XL", "XXL"], name: "هودي زيب بيج بطبعة جرافيتي",
    price: 600, oldPrice: 0, emoji: "🧥", image: "images/zip-hoodie-graffiti-beige.jpg", images: ["images/zip-hoodie-graffiti-beige.jpg"], badge: "جديد", inStock: true,
    desc: "نفس تصميم الجرافيتي بلون بيج وطباعة سودا.",
    details: "هودي بسوستة كاملة بلون بيج فاتح وطباعة جرافيتي سودا على الصدر والكمين. لون هادي بيطلّع الطباعة بوضوح.",
    features: ["سوستة معدنية كاملة في المقدمة", "طباعة جرافيتي سودا على الصدر والكمين", "جيبين أمامين", "كابوشون بخيوط ربط"],
    specs: [["اللون", "بيج"], ["النوع", "هودي بسوستة"]]
  },
  {
    id: 18, category: "clothes", vendor: "العبدلله", sizes: ["30", "32", "34", "36", "38"], name: "جينز أسود بحزام حبل",
    price: 750, oldPrice: 0, emoji: "👖", image: "images/jeans-rope-black.jpg", images: ["images/jeans-rope-black.jpg"], badge: "", inStock: true,
    desc: "جينز أسود غامق بغسلة خفيفة وحزام حبل ملوّن.",
    details: "جينز أسود غامق بغسلة خفيفة وقصة مريحة. الإغلاق بأزرار ظاهرة في المقدمة وحزام حبل بلونين (بيج وبني) بيدّي شكل عصري مميز.",
    features: ["إغلاق بأزرار ظاهرة", "حزام حبل بلونين بيج وبني", "خياطة بارزة بخيط فاتح", "جيوب أمامية وجيب صغير"],
    specs: [["اللون", "أسود"], ["النوع", "جينز"]]
  },
  {
    id: 19, category: "clothes", vendor: "العبدلله", sizes: ["30", "32", "34", "36", "38"], name: "جينز أزرق بحزام حبل بشراشيب",
    price: 750, oldPrice: 0, emoji: "👖", image: "images/jeans-rope-blue.jpg", images: ["images/jeans-rope-blue.jpg"], badge: "", inStock: true,
    desc: "جينز أزرق بغسلة كلاسيك وحزام حبل بشراشيب.",
    details: "جينز أزرق بغسلة كلاسيك وقصة مستقيمة مريحة، بأزرار ظاهرة في المقدمة وحزام حبل بيج وبني بشراشيب في الأطراف.",
    features: ["إغلاق بأزرار ظاهرة", "حزام حبل بيج وبني بشراشيب", "خياطة بخيط برتقالي", "جيوب أمامية وجيب صغير"],
    specs: [["اللون", "أزرق"], ["النوع", "جينز"]]
  },
  {
    id: 20, category: "clothes", vendor: "العبدلله", sizes: ["30", "32", "34", "36", "38"], name: "جينز أزرق مستقيم كلاسيك",
    price: 750, oldPrice: 0, emoji: "👖", image: "images/jeans-straight-blue.jpg", images: ["images/jeans-straight-blue.jpg"], badge: "", inStock: true,
    desc: "جينز أزرق كحلي بقصة مستقيمة مريحة للاستخدام اليومي.",
    details: "جينز أزرق كحلي بقصة مستقيمة مريحة وشكل كلاسيك بيمشي مع التيشيرتات والهوديز والقمصان. بخياطة واضحة وجيوب عملية.",
    features: ["قصة مستقيمة مريحة", "لون أزرق كحلي كلاسيك", "جيوب أمامية وجيب صغير", "مناسب للاستخدام اليومي"],
    specs: [["اللون", "أزرق كحلي"], ["النوع", "جينز"]]
  },
  {
    id: 21, category: "clothes", vendor: "العبدلله", sizes: ["M", "L", "XL", "XXL"], name: "بنطلون رياضي أسود بخطوط جانبية",
    price: 350, oldPrice: 0, emoji: "👖", image: "images/pants-stripes-black.jpg", images: ["images/pants-stripes-black.jpg"], badge: "", inStock: true,
    desc: "بنطلون رياضي أسود بخطين أبيض على الجنبين وخصر مطاط.",
    details: "بنطلون رياضي أسود بخطين أبيض على الجنبين وخصر مطاط بخيط ربط أبيض وجيوب جانبية. مناسب للجيم والبيت والخروج.",
    features: ["خصر مطاط بخيط ربط", "خطين أبيض على الجنبين", "جيوب جانبية", "مريح للجيم والاستخدام اليومي"],
    specs: [["اللون", "أسود × أبيض"], ["النوع", "بنطلون رياضي"]]
  },
  {
    id: 22, category: "clothes", vendor: "العبدلله", sizes: ["M", "L", "XL", "XXL"], name: "تيشيرت أسود بحواف بيضاء",
    price: 220, oldPrice: 0, emoji: "👕", image: "images/tshirt-ringer-black.jpg", images: ["images/tshirt-ringer-black.jpg"], badge: "", inStock: true,
    desc: "تيشيرت أسود سادة بياقة وحواف أكمام بيضاء.",
    details: "تيشيرت أسود سادة بياقة دائرية وحواف أكمام بيضاء بتدّيه شكل رياضي كلاسيك. بسيط وسهل تنسقه مع أي بنطلون.",
    features: ["ياقة دائرية بحافة بيضاء", "حواف أكمام بيضاء", "تصميم سادة بسيط", "مناسب لكل يوم"],
    specs: [["اللون", "أسود × أبيض"], ["النوع", "تيشيرت"]]
  },
  {
    id: 23, category: "perfumes", brand: "My Way", name: "برفان حنين - Hanin",
    price: 180, oldPrice: 0, emoji: "🧴", image: "images/hanin.jpg", images: ["images/hanin.jpg"], badge: "", inStock: true,
    desc: "برفان حريمي Eau de Toilette بزجاجة دائرية دهبية شيك.",
    details: "برفان حريمي من My Way بزجاجة دائرية بغطاء كريستال ولمسات دهبية، واسم حنين مكتوب بخط عربي زخرفي. مناسب للاستخدام اليومي والمناسبات.",
    features: ["زجاجة دائرية بغطاء كريستال", "خط عربي زخرفي على العبوة", "مناسب للاستخدام اليومي"],
    specs: [["العلامة", "My Way"], ["التركيز", "Eau de Toilette"], ["النوع", "حريمي"]]
  },
  {
    id: 24, category: "perfumes", brand: "My Way", name: "برفان إيموشن - Emotion",
    price: 220, oldPrice: 0, emoji: "🧴", image: "images/emotion.jpg", images: ["images/emotion.jpg"], badge: "", inStock: true,
    desc: "برفان حريمي بزجاجة حمراء وغطاء دهبي.",
    details: "برفان حريمي بزجاجة حمراء متدرجة وطرف دهبي لامع، شكلها جذاب وهدية حلوة لأي مناسبة.",
    features: ["زجاجة حمراء متدرجة", "غطاء دهبي لامع", "مناسب كهدية"],
    specs: [["العلامة", "My Way"], ["النوع", "حريمي"]]
  },
  {
    id: 25, category: "perfumes", brand: "My Way", name: "برفان أليور جولد - Allure Gold",
    price: 250, oldPrice: 0, emoji: "🧴", image: "images/allure-gold.jpg", images: ["images/allure-gold.jpg"], badge: "", inStock: true,
    desc: "برفان Eau de Parfum بزجاجة مضلّعة ولون دهبي.",
    details: "برفان من My Way بتركيز Eau de Parfum، زجاجته مضلّعة بغطاء كريستال ولون دهبي دافي. أنيق ومناسب للمناسبات.",
    features: ["تركيز Eau de Parfum", "زجاجة مضلّعة بغطاء كريستال", "لون دهبي دافي"],
    specs: [["العلامة", "My Way"], ["التركيز", "Eau de Parfum"], ["النوع", "حريمي"]]
  },
  {
    id: 26, category: "perfumes", brand: "My Way", name: "برفان سوليتير - Solitaire",
    price: 600, oldPrice: 0, emoji: "🧴", image: "images/solitaire.jpg", images: ["images/solitaire.jpg"], badge: "", inStock: true,
    desc: "برفان Eau de Parfum بزجاجة فضية بتصميم ماسي.",
    details: "برفان من My Way بتركيز Eau de Parfum، زجاجته فضية بنقشة سداسية لامعة وغطاء أسود. أفخم إصدارات التشكيلة.",
    features: ["تركيز Eau de Parfum", "زجاجة فضية بنقشة سداسية", "غطاء أسود بتصميم مميز"],
    specs: [["العلامة", "My Way"], ["التركيز", "Eau de Parfum"]]
  },
  {
    id: 27, category: "perfumes", brand: "My Way", name: "برفان برنسيس - Princess",
    price: 140, oldPrice: 0, emoji: "🧴", image: "images/princess.jpg", images: ["images/princess.jpg"], badge: "", inStock: true,
    desc: "برفان Eau de Toilette بزجاجة وردي هادية.",
    details: "برفان من My Way بزجاجة شفافة وغطاء وردي ناعم. خفيف وبسيط ومناسب للاستخدام اليومي.",
    features: ["زجاجة شفافة بغطاء وردي", "خفيف ومناسب للاستخدام اليومي", "سعر اقتصادي"],
    specs: [["العلامة", "My Way"], ["التركيز", "Eau de Toilette"], ["النوع", "حريمي"]]
  },
  {
    id: 28, category: "perfumes", brand: "My Way", name: "برفان زد - Zed (بدون كحول)",
    price: 270, oldPrice: 0, emoji: "🧴", image: "images/zed.jpg", images: ["images/zed.jpg"], badge: "", inStock: true,
    desc: "برفان بدون كحول بزجاجة بيضاء وغطاء نحاسي.",
    details: "برفان Zed من My Way بدون كحول، زجاجته بيضاء بشكل نجمي وغطاء بشعار نحاسي مميز.",
    features: ["بدون كحول", "زجاجة بتصميم نجمي", "شعار نحاسي على الغطاء"],
    specs: [["العلامة", "My Way"], ["الكحول", "بدون كحول"], ["النوع", "رجالي"]]
  },
  {
    id: 29, category: "perfumes", brand: "My Way", name: "برفان وان - One",
    price: 150, oldPrice: 0, emoji: "🧴", image: "images/one.jpg", images: ["images/one.jpg"], badge: "", inStock: true,
    desc: "برفان Eau de Toilette بزجاجة بيضاء مودرن.",
    details: "برفان ONE من My Way بتركيز Eau de Toilette، زجاجة بيضاء مسطحة وتصميم مينيمال بكتابة بورجوندي.",
    features: ["تصميم مينيمال", "زجاجة بيضاء مسطحة", "سعر اقتصادي"],
    specs: [["العلامة", "My Way"], ["التركيز", "Eau de Toilette"]]
  },
  {
    id: 30, category: "perfumes", brand: "My Way", name: "برفان بوم - Boom",
    price: 350, oldPrice: 0, emoji: "🧴", image: "images/boom.jpg", images: ["images/boom.jpg"], badge: "", inStock: true,
    desc: "برفان Eau de Toilette بزجاجة على شكل قنبلة.",
    details: "برفان Boom من My Way بزجاجة سودة على شكل قنبلة يدوية، تصميم جريء ومختلف ومناسب كهدية.",
    features: ["زجاجة بتصميم قنبلة يدوية", "لون أسود لافت", "مناسب كهدية"],
    specs: [["العلامة", "My Way"], ["التركيز", "Eau de Toilette"], ["النوع", "رجالي"]]
  },
  {
    id: 31, category: "perfumes", brand: "My Way", name: "برفان توباكو لوكس - Tobacco Luxe",
    price: 300, oldPrice: 0, emoji: "🧴", image: "images/tobacco-luxe.jpg", images: ["images/tobacco-luxe.jpg"], badge: "", inStock: true,
    desc: "برفان Eau de Parfum بزجاجة سودة مات وكتابة دهبية.",
    details: "برفان من My Way بتركيز Eau de Parfum، زجاجة سودة مات بكتابة دهبية وتصميم فخم وبسيط.",
    features: ["تركيز Eau de Parfum", "زجاجة سودة مات", "كتابة دهبية أنيقة"],
    specs: [["العلامة", "My Way"], ["التركيز", "Eau de Parfum"], ["النوع", "رجالي"]]
  },
  {
    id: 32, category: "perfumes", brand: "My Way", name: "برفان سيليكشن - Selection",
    price: 260, oldPrice: 0, emoji: "🧴", image: "images/selection.jpg", images: ["images/selection.jpg"], badge: "", inStock: true,
    desc: "برفان بزجاجة متدرجة من البيج للبني وغطاء معدني.",
    details: "برفان Selection من My Way بزجاجة متدرجة من البيج للبني وغطاء معدني منقوش، شكل كلاسيك أنيق.",
    features: ["زجاجة متدرجة بيج × بني", "غطاء معدني منقوش", "تصميم كلاسيك"],
    specs: [["العلامة", "My Way"], ["النوع", "رجالي"]]
  },
  {
    id: 33, category: "perfumes", brand: "My Way", name: "برفان سبورتي داي - Sporty Day",
    price: 170, oldPrice: 0, emoji: "🧴", image: "images/sporty-day.jpg", images: ["images/sporty-day.jpg"], badge: "", inStock: true,
    desc: "برفان Eau de Parfum بزجاجة بيضاء سبورت.",
    details: "برفان Sporty Day من My Way بتركيز Eau de Parfum، زجاجة بيضاء بتصميم سبورت وجانب منقّط، مناسب للاستخدام اليومي.",
    features: ["تركيز Eau de Parfum", "تصميم سبورت", "مناسب للاستخدام اليومي"],
    specs: [["العلامة", "My Way"], ["التركيز", "Eau de Parfum"]]
  },
  {
    id: 34, category: "beauty", brand: "My Way", name: "غسول لين للمناطق الحساسة - Leen Intimate Wash",
    price: 90, oldPrice: 0, emoji: "🌸", image: "images/lin-intimate.jpg", images: ["images/lin-intimate.jpg"], badge: "", inStock: true,
    desc: "غسول للعناية بالمناطق الحساسة، 200 مل.",
    details: "غسول لين للعناية بالمناطق الحساسة بتركيبة متوازنة الـ pH ومستخلصات طبيعية، عبوة بمضخة 200 مل.",
    features: ["pH متوازن", "مستخلصات طبيعية", "عبوة بمضخة سهلة الاستخدام"],
    specs: [["الحجم", "200 مل"], ["العلامة", "My Way"]]
  },
  {
    id: 35, category: "beauty", brand: "My Way", name: "زبدة الجسم Soft Skin - فانيليا وتوت",
    price: 85, oldPrice: 0, emoji: "🌸", image: "images/softskin-berries.jpg", images: ["images/softskin-berries.jpg"], badge: "", inStock: true,
    desc: "زبدة مغذية للبشرة الجافة بزيت اللوز والجوجوبا.",
    details: "زبدة جسم Soft Skin بنكهة Wild Vanilla Berries (فانيليا وتوت)، غنية بزيت اللوز والجوجوبا لترطيب وتغذية البشرة الجافة.",
    features: ["غنية بزيت اللوز والجوجوبا", "للبشرة الجافة", "رائحة فانيليا وتوت"],
    specs: [["الرائحة", "Wild Vanilla Berries"], ["العلامة", "My Way"]]
  },
  {
    id: 36, category: "beauty", brand: "My Way", name: "زبدة الجسم Soft Skin - جوز الهند",
    price: 70, oldPrice: 0, emoji: "🌸", image: "images/softskin-coconut.jpg", images: ["images/softskin-coconut.jpg"], badge: "", inStock: true,
    desc: "زبدة مغذية للبشرة الجافة بزيت اللوز والجوجوبا.",
    details: "زبدة جسم Soft Skin بنكهة Coconut & Vanilla (جوز الهند والفانيليا)، غنية بزيت اللوز والجوجوبا لترطيب وتغذية البشرة الجافة.",
    features: ["غنية بزيت اللوز والجوجوبا", "للبشرة الجافة", "رائحة جوز الهند والفانيليا"],
    specs: [["الرائحة", "Coconut & Vanilla"], ["العلامة", "My Way"]]
  },
  {
    id: 37, category: "beauty", brand: "My Way", name: "سيرم الوجه جميلة - Gamila Face Serum",
    price: 90, oldPrice: 0, emoji: "🌸", image: "images/gamila-serum.jpg", images: ["images/gamila-serum.jpg"], badge: "", inStock: true,
    desc: "سيرم بفيتامين E وزيت الأرجان لنضارة ونعومة الوجه.",
    details: "سيرم وجه من جميلة بفيتامين E وزيت الأرجان، بيدّي البشرة نضارة وتغذية ونعومة. عبوة بمضخة.",
    features: ["فيتامين E", "زيت الأرجان", "نضارة وتغذية ونعومة"],
    specs: [["العلامة", "جميلة (My Way)"]]
  },
  {
    id: 38, category: "beauty", brand: "My Way", name: "ماسك القناع الذهبي - Bride Peel Off Golden Mask",
    price: 65, oldPrice: 0, emoji: "🌸", image: "images/bride-gold-mask.jpg", images: ["images/bride-gold-mask.jpg"], badge: "", inStock: true,
    desc: "ماسك قابل للتقشير لنضارة البشرة وشد التجاعيد.",
    details: "ماسك العروسة الذهبي (Peel off) بيساعد على إعادة الحيوية والنضارة للبشرة وتفتيح اللون وشد التجاعيد.",
    features: ["ماسك قابل للتقشير", "يعيد الحيوية والنضارة", "يفتّح لون البشرة"],
    specs: [["العلامة", "العروسة (My Way)"], ["النوع", "Peel Off"]]
  },
  {
    id: 39, category: "beauty", brand: "My Way", name: "ماسك الفحم - Bride Peel Off Coal Mask",
    price: 65, oldPrice: 0, emoji: "🌸", image: "images/bride-coal-mask.jpg", images: ["images/bride-coal-mask.jpg"], badge: "", inStock: true,
    desc: "ماسك فحم قابل للتقشير لإزالة الرؤوس السوداء.",
    details: "ماسك العروسة بالفحم (Peel off) بيزيل الرؤوس السوداء ويعيد النضارة للبشرة.",
    features: ["ماسك قابل للتقشير", "يزيل الرؤوس السوداء", "يعيد النضارة للبشرة"],
    specs: [["العلامة", "العروسة (My Way)"], ["النوع", "Peel Off"]]
  },
  {
    id: 40, category: "beauty", brand: "My Way", name: "ماسك الطمي بالكركم - Gamila Mud Mask",
    price: 85, oldPrice: 0, emoji: "🌸", image: "images/gamila-mud-mask.jpg", images: ["images/gamila-mud-mask.jpg"], badge: "", inStock: true,
    desc: "ماسك طمي بالكركم لتنقية وتفتيح البشرة.",
    details: "ماسك جميلة بالطمي والكركم لتنقية البشرة وتفتيحها.",
    features: ["طمي مع الكركم", "لتنقية البشرة", "لتفتيح البشرة"],
    specs: [["العلامة", "جميلة (My Way)"], ["المكوّن", "طمي + كركم"]]
  },
  {
    id: 41, category: "beauty", brand: "My Way", name: "غسول وجه Aqua Boost - Watery Gel",
    price: 80, oldPrice: 0, emoji: "🌸", image: "images/aqua-boost.jpg", images: ["images/aqua-boost.jpg"], badge: "", inStock: true,
    desc: "غسول وجه بتركيبة جل مائية منعشة.",
    details: "غسول الوجه Aqua Boost من My Way بتركيبة Watery Gel، عبوة بمضخة بلون تركواز منعش.",
    features: ["تركيبة جل مائية", "عبوة بمضخة", "ملمس منعش"],
    specs: [["العلامة", "My Way"], ["النوع", "غسول وجه"]]
  },
  {
    id: 42, category: "beauty", brand: "My Way", name: "غسول جسم باليوريا - Simply Moist",
    price: 140, oldPrice: 0, emoji: "🌸", image: "images/simply-moist.jpg", images: ["images/simply-moist.jpg"], badge: "", inStock: true,
    desc: "غسول للجسم بتركيز 5% يوريا لترطيب مكثف.",
    details: "غسول جسم Simply Moist بتركيبة غنية بـ 5% يوريا، بيدّي ترطيب مكثف وبيحسّن مظهر جلد الوزّة.",
    features: ["5% يوريا", "ترطيب مكثف", "يحسّن مظهر جلد الوزّة"],
    specs: [["التركيز", "5% يوريا"], ["العلامة", "My Way"]]
  },
  {
    id: 46, category: "beauty", brand: "My Way", name: "بخاخ الجسم Miniz (مارشميلو - بطيخ - توت)",
    price: 50, oldPrice: 0, emoji: "🌸", image: "images/miniz.jpg", images: ["images/miniz.jpg"], badge: "", inStock: true,
    desc: "بودي سبلاش للبنات بروائح فواكه منعشة.",
    details: "Body Splash للبنات بثلاث روائح: مارشميلو وبطيخ وتوت. عبوات صغيرة ملونة سهلة تتشال في الشنطة.",
    features: ["3 روائح: مارشميلو - بطيخ - توت", "عبوة بخاخ صغيرة", "سهل يتشال في الشنطة"],
    specs: [["العلامة", "My Way"], ["النوع", "Body Splash"]]
  },
  {
    id: 47, category: "cleaning", brand: "My Way", name: "اللهلوبة بالليمون",
    price: 100, oldPrice: 0, emoji: "🧽", image: "images/lahloba.jpg", images: ["images/lahloba.jpg"], badge: "", inStock: true,
    desc: "منظف شديد القوة متعدد الأغراض برائحة الليمون.",
    details: "منظف اللهلوبة برائحة الليمون، شديد القوة ومتعدد الأغراض، يكفي 12 استخدام.",
    features: ["شديد القوة", "متعدد الأغراض", "برائحة الليمون", "12 استخدام"],
    specs: [["الرائحة", "ليمون"], ["النوع", "منظف متعدد الأغراض"]]
  },
  {
    id: 48, category: "cleaning", brand: "My Way", name: "معطر جو Air Touch - أريج الفجر",
    price: 90, oldPrice: 0, emoji: "🧴", image: "images/air-touch.jpg", images: ["images/air-touch.jpg"], badge: "", inStock: true,
    desc: "معطر جو بخاخ برائحة زهور منعشة.",
    details: "معطر الجو Air Touch بعطر أريج الفجر، عبوة بخاخ بزناد وعطر زهري ناعم يملّا المكان.",
    features: ["عطر أريج الفجر", "عبوة بخاخ بزناد", "رائحة زهرية منعشة"],
    specs: [["العلامة", "My Way"], ["النوع", "معطر جو"]]
  },
  {
    id: 49, category: "cleaning", brand: "My Way", name: "باور 7 في 1 - بخاخ منظف",
    price: 80, oldPrice: 0, emoji: "🧽", image: "images/power-7in1.jpg", images: ["images/power-7in1.jpg"], badge: "", inStock: true,
    desc: "بخاخ منظف متعدد الاستخدامات 7 في 1.",
    details: "منظف Power 7 في 1 على شكل بخاخ، لإزالة البقع وتنظيف أكتر من سطح.",
    features: ["7 استخدامات في منتج واحد", "عبوة بخاخ بزناد", "سهل الاستخدام"],
    specs: [["العلامة", "My Way"], ["النوع", "بخاخ منظف"]]
  },
  {
    id: 50, category: "cleaning", brand: "My Way", name: "باور بلس - منظف حمامات",
    price: 100, oldPrice: 0, emoji: "🚽", image: "images/power-plus.jpg", images: ["images/power-plus.jpg"], badge: "", inStock: true,
    desc: "مزيل تكلسات المراحيض بفاعلية أقوى.",
    details: "Power Plus مزيل تكلسات المراحيض، بفاعلية أقوى وعبوة منحنية توصل لتحت الحافة.",
    features: ["مزيل تكلسات", "فاعلية أقوى", "عبوة منحنية", "720 مل"],
    specs: [["العلامة", "My Way"], ["الحجم", "720 مل"]]
  },
  {
    id: 51, category: "cleaning", brand: "My Way", name: "باور جل - منظف غسيل",
    price: 140, oldPrice: 0, emoji: "🧺", image: "images/power-gel.jpg", images: ["images/power-gel.jpg"], badge: "", inStock: true,
    desc: "جل غسيل للملابس بعبوة 950 مل.",
    details: "Power Gel منظف غسيل سائل بعبوة سوداء بمقبض، بحجم 950 مل.",
    features: ["جل غسيل", "عبوة بمقبض", "950 مل"],
    specs: [["العلامة", "My Way"], ["الحجم", "950 مل"]]
  },
  {
    id: 52, category: "cleaning", brand: "My Way", name: "باور مزيل البقع الفوري",
    price: 100, oldPrice: 0, emoji: "🧽", image: "images/power-stain.jpg", images: ["images/power-stain.jpg"], badge: "", inStock: true,
    desc: "بخاخ مزيل للبقع بشكل فوري.",
    details: "Power مزيل البقع الفوري على شكل بخاخ صغير، مناسب لمعالجة البقع على الهدوم.",
    features: ["مفعول فوري", "عبوة بخاخ صغيرة", "للبقع على الملابس"],
    specs: [["العلامة", "My Way"], ["النوع", "مزيل بقع"]]
  },
  {
    id: 53, category: "beauty", brand: "My Way", name: "بيلا - بلسم شفايف (Cherry)",
    price: 50, oldPrice: 0, emoji: "💄", image: "images/bella-balm.jpg", images: ["images/bella-balm.jpg"], badge: "", inStock: true,
    desc: "بلسم شفايف بنكهة الكرز.",
    details: "Bella بلسم شفايف بعبوة برطمان صغيرة بنكهة الكرز، لترطيب الشفايف.",
    features: ["نكهة الكرز", "عبوة برطمان", "لترطيب الشفايف"],
    specs: [["العلامة", "My Way"], ["النوع", "بلسم شفايف"]]
  },
  {
    id: 54, category: "beauty", brand: "My Way", name: "بيلا - مرطب شفايف",
    price: 50, oldPrice: 0, emoji: "💄", image: "images/bella-moist.jpg", images: ["images/bella-moist.jpg"], badge: "", inStock: true,
    desc: "مرطب شفايف بأربع نكهات.",
    details: "Bella مرطب شفايف بتيوب عملي، متوفر بنكهات: علكة وشوكولاتة وفراولة وجوز الهند.",
    features: ["4 نكهات: علكة - شوكولاتة - فراولة - جوز الهند", "تيوب عملي", "لترطيب الشفايف"],
    specs: [["العلامة", "My Way"], ["النوع", "مرطب شفايف"]]
  },
  {
    id: 55, category: "cleaning", brand: "My Way", name: "جل منظف لغسالة الأطباق - Bright",
    price: 180, oldPrice: 0, emoji: "🍋", image: "images/bright-dish.jpg", images: ["images/bright-dish.jpg"], badge: "", inStock: true,
    desc: "جل منظف لغسالات الأطباق 3 في 1 برائحة الليمون.",
    details: "Bright All in 1 Max جل منظف لغسالات الأطباق، 3 في 1 برائحة الليمون، بعبوة 600 مل.",
    features: ["3 في 1", "برائحة الليمون", "600 مل", "مخصوص لغسالات الأطباق"],
    specs: [["العلامة", "My Way"], ["الحجم", "600 مل"], ["الرائحة", "ليمون"]]
  },
  {
    id: 56, category: "cleaning", brand: "My Way", name: "سوبر كلين (Clean't All)",
    price: 150, oldPrice: 0, emoji: "🧴", image: "images/super-clean.jpg", images: ["images/super-clean.jpg"], badge: "", inStock: true,
    desc: "منظف ومطهر عام مركز متعدد الأغراض.",
    details: "Super Clean't All منظف ومطهر عام مركز مضاد للبكتيريا ومتعدد الأغراض، عبوة 500 مل.",
    features: ["مركز ومتعدد الأغراض", "مضاد للبكتيريا", "500 مل"],
    specs: [["العلامة", "My Way"], ["الحجم", "500 مل"]]
  },
  {
    id: 57, category: "cleaning", brand: "My Way", name: "سيكريت جاردن - حلم السعادة",
    price: 150, oldPrice: 0, emoji: "🌸", image: "images/secret.jpg", images: ["images/secret.jpg"], badge: "", inStock: true,
    desc: "معطر منزلي متعدد الأغراض بفقاعات العطور.",
    details: "Secret Garden حلم السعادة معطر منزلي متعدد الأغراض بفقاعات العطور، لتعطير أرضيات وأسطح البيت.",
    features: ["معطر منزلي متعدد الأغراض", "بفقاعات العطور", "رائحة زهرية فاخرة"],
    specs: [["العلامة", "My Way"], ["النوع", "معطر منزلي"]]
  },
  {
    id: 58, category: "cleaning", brand: "My Way", name: "غسول الصحون بالليمون - Clean",
    price: 140, oldPrice: 0, emoji: "🍋", image: "images/clean-dish.jpg", images: ["images/clean-dish.jpg"], badge: "", inStock: true,
    desc: "سائل غسيل الصحون برائحة الليمون.",
    details: "Clean سائل غسيل الصحون بلمعة الليمون، فعال على الدهون وجميع الأواني.",
    features: ["برائحة الليمون", "يزيل الدهون", "فعال على جميع الأواني"],
    specs: [["العلامة", "My Way"], ["الرائحة", "ليمون"]]
  },
  {
    id: 59, category: "beauty", brand: "My Way", name: "كريم Aqua Boost - جل كريم مرطب للوجه",
    price: 60, oldPrice: 110, emoji: "💧", image: "images/aqua-cream.jpg", images: ["images/aqua-cream.jpg"], badge: "خصم 50 ج", inStock: true,
    desc: "جل كريم مرطب للوجه لتعزيز ترطيب البشرة. عليه خصم 50 جنيه.",
    details: "Aqua Boost Hydrating Gel Cream جل كريم مرطب للوجه بتركيبة مائية خفيفة بيعزز ترطيب البشرة. السعر الأصلي 110 جنيه وعليه خصم 50 جنيه.",
    features: ["جل كريم مرطب للوجه", "يعزز ترطيب البشرة", "ملمس خفيف", "خصم 50 جنيه"],
    specs: [["العلامة", "My Way"], ["النوع", "جل كريم للوجه"]]
  },
  {
    id: 60, category: "cleaning", brand: "My Way", name: "كلين - منظف ولمّع الإستانلس ستيل",
    price: 65, oldPrice: 0, emoji: "✨", image: "images/clean-steel.jpg", images: ["images/clean-steel.jpg"], badge: "", inStock: true,
    desc: "منظف ولمّع للأسطح المصنوعة من الإستانلس ستيل.",
    details: "Clean منظف ولمّع الإستانلس ستيل للأحواض والحلل والأسطح المعدنية، عبوة 160 مل.",
    features: ["ينظف ويلمّع", "للأحواض والحلل", "160 مل"],
    specs: [["العلامة", "My Way"], ["الحجم", "160 مل"]]
  },
  {
    id: 61, category: "cleaning", brand: "My Way", name: "كلين - سبراي منظف الثلاجات والميكروويف",
    price: 75, oldPrice: 0, emoji: "🧽", image: "images/clean-fridge.jpg", images: ["images/clean-fridge.jpg"], badge: "", inStock: true,
    desc: "سبراي منظف للثلاجات والميكروويف.",
    details: "Clean سبراي منظف للثلاجات والميكروويف بعبوة بزناد سهلة الاستخدام.",
    features: ["للثلاجات والميكروويف", "عبوة بزناد", "سهل الاستخدام"],
    specs: [["العلامة", "My Way"], ["النوع", "سبراي منظف"]]
  },
  {
    id: 62, category: "cleaning", brand: "My Way", name: "كلين - منظف ولمّع الأحذية الرياضية",
    price: 40, oldPrice: 0, emoji: "👟", image: "images/clean-shoes.jpg", images: ["images/clean-shoes.jpg"], badge: "", inStock: true,
    desc: "منظف ولمّع للأحذية الرياضية بكل الألوان.",
    details: "Clean منظف ولمّع للأحذية الرياضية لجميع الألوان، عبوة بخاخ صغيرة.",
    features: ["لجميع الألوان", "عبوة بخاخ صغيرة", "للأحذية الرياضية"],
    specs: [["العلامة", "My Way"], ["النوع", "منظف أحذية"]]
  },
  {
    id: 63, category: "cleaning", brand: "My Way", name: "كلين - منظف المفروشات والستائر",
    price: 70, oldPrice: 0, emoji: "🛋️", image: "images/clean-curtain.jpg", images: ["images/clean-curtain.jpg"], badge: "", inStock: true,
    desc: "منظف للمفروشات والستائر بدون رغوة.",
    details: "Clean منظف المفروشات والستائر بدون رغوة.",
    features: ["للمفروشات والستائر", "بدون رغوة"],
    specs: [["العلامة", "My Way"], ["النوع", "منظف مفروشات"]]
  },
  {
    id: 64, category: "cleaning", brand: "My Way", name: "كلين - شامبو منظف ومزيل بقع السجاد",
    price: 80, oldPrice: 0, emoji: "🧽", image: "images/clean-carpet.jpg", images: ["images/clean-carpet.jpg"], badge: "", inStock: true,
    desc: "شامبو لتنظيف السجاد وإزالة البقع.",
    details: "Clean شامبو منظف ومزيل لبقع السجاد، أكتر فاعلية، عبوة 550 مل.",
    features: ["ينظف السجاد", "يزيل البقع", "أكتر فاعلية", "550 مل"],
    specs: [["العلامة", "My Way"], ["الحجم", "550 مل"]]
  },
  {
    id: 65, category: "beauty", brand: "My Way", name: "ديليكيت B3 - كريم توحيد لون البشرة",
    price: 80, oldPrice: 120, emoji: "🌸", image: "images/delicate.jpg", images: ["images/delicate.jpg"], badge: "خصم 40 ج", inStock: true,
    desc: "كريم لتوحيد لون البشرة وواقي من أشعة الشمس فوق البنفسجية.",
    details: "Delicate Even Tone كريم غني بفيتامين B3 لتوحيد لون البشرة، وواقي من أشعة الشمس فوق البنفسجية.",
    features: ["غني بفيتامين B3", "يوحّد لون البشرة", "واقي من أشعة الشمس فوق البنفسجية"],
    specs: [["العلامة", "My Way"], ["المكوّن", "فيتامين B3"]]
  },
  {
    id: 66, category: "beauty", brand: "My Way", name: "دلكة - سكراب للجسم Soft Skin",
    price: 130, oldPrice: 150, emoji: "🌸", image: "images/dolka.jpg", images: ["images/dolka.jpg"], badge: "خصم 20 ج", inStock: true,
    desc: "سكراب للجسم بزبدة الشيا، عبوة 250 جم.",
    details: "Soft Skin دلكة سكراب للجسم بزبدة الشيا، عبوة 250 جم بتصميم مزخرف مميز.",
    features: ["بزبدة الشيا", "سكراب للجسم", "250 جم"],
    specs: [["العلامة", "Soft Skin (My Way)"], ["الوزن", "250 جم"]]
  },
  {
    id: 67, category: "beauty", brand: "My Way", name: "كريم اليد والجسم Soft Skin - Magic Belle",
    price: 35, oldPrice: 45, emoji: "🌸", image: "images/softskin-magic.jpg", images: ["images/softskin-magic.jpg"], badge: "خصم 10 ج", inStock: true,
    desc: "كريم يومي لليد والجسم لترطيب وتنعيم البشرة.",
    details: "Soft Skin Hand & Body Cream بعطر Magic Belle، كريم يومي لليد والجسم لترطيب وتنعيم البشرة بزبدة الشيا والكاكاو.",
    features: ["ترطيب وتنعيم البشرة", "بزبدة الشيا والكاكاو", "للاستخدام اليومي"],
    specs: [["العلامة", "Soft Skin (My Way)"], ["العطر", "Magic Belle"]]
  },
  {
    id: 68, category: "beauty", brand: "My Way", name: "كريم اليد والجسم Soft Skin - Wild Vanilla Berries",
    price: 35, oldPrice: 45, emoji: "🌸", image: "images/softskin-vanilla.jpg", images: ["images/softskin-vanilla.jpg"], badge: "خصم 10 ج", inStock: true,
    desc: "كريم يومي لليد والجسم لترطيب وتنعيم البشرة.",
    details: "Soft Skin Hand & Body Cream بعطر Wild Vanilla Berries (فانيليا وتوت)، لترطيب وتنعيم البشرة بزبدة الشيا والكاكاو.",
    features: ["ترطيب وتنعيم البشرة", "بزبدة الشيا والكاكاو", "للاستخدام اليومي"],
    specs: [["العلامة", "Soft Skin (My Way)"], ["العطر", "فانيليا وتوت"]]
  },
  {
    id: 69, category: "cleaning", brand: "My Way", name: "باور جل - مضاد للبكتيريا برائحة اللافندر",
    price: 101, oldPrice: 131, emoji: "🧺", image: "images/power-lavender.jpg", images: ["images/power-lavender.jpg"], badge: "خصم 30 ج", inStock: true,
    desc: "منظف للملابس السوداء والألوان الداكنة والجينز، مضاد للبكتيريا.",
    details: "Power Gel منظف للملابس السوداء والألوان الداكنة والجينز للغسالات الأوتوماتيك والغسيل اليدوي، مضاد للبكتيريا برائحة اللافندر.",
    features: ["للملابس السوداء والداكنة والجينز", "للغسالات الأوتوماتيك واليدوي", "مضاد للبكتيريا", "برائحة اللافندر"],
    specs: [["العلامة", "My Way"], ["الرائحة", "لافندر"]]
  },
  {
    id: 70, category: "cleaning", brand: "My Way", name: "باور - مذيب الحروق والدهون",
    price: 90, oldPrice: 110, emoji: "🔥", image: "images/burn-remover.jpg", images: ["images/burn-remover.jpg"], badge: "خصم 20 ج", inStock: true,
    desc: "بخاخ مذيب للحروق والدهون، عبوة 480 مل.",
    details: "Power مذيب الحروق والدهون بخاخ أكتر قوة، مناسب للأفران والبوتاجازات، عبوة 480 مل.",
    features: ["أكتر قوة", "عبوة بخاخ بزناد", "480 مل"],
    specs: [["العلامة", "My Way"], ["الحجم", "480 مل"]]
  },
  {
    id: 71, category: "cleaning", brand: "My Way", name: "كلين - منظف ولمّع ومعطر (برتقال)",
    price: 90, oldPrice: 110, emoji: "✨", image: "images/clean-polish.jpg", images: ["images/clean-polish.jpg"], badge: "خصم 20 ج", inStock: true,
    desc: "منظف ولمّع ومعطر للأثاث الخشبي والجلود وتابلوهات السيارات.",
    details: "Clean منظف ولمّع ومعطر برائحة البرتقال، لجميع أنواع الأثاث الخشبي والجلود وتابلوهات السيارات.",
    features: ["للأثاث الخشبي", "للجلود", "لتابلوهات السيارات", "برائحة البرتقال"],
    specs: [["العلامة", "My Way"], ["الرائحة", "برتقال"]]
  },
  {
    id: 72, category: "cleaning", brand: "My Way", name: "كلين - منظف ومطهر الخضروات والفواكه",
    price: 60, oldPrice: 80, emoji: "🥦", image: "images/clean-veg.jpg", images: ["images/clean-veg.jpg"], badge: "خصم 20 ج", inStock: true,
    desc: "مطهر ومنظف للخضروات والفواكه.",
    details: "Clean مطهر ومنظف للخضروات والفواكه بحماية فعالة من الجراثيم.",
    features: ["للخضروات والفواكه", "حماية فعالة من الجراثيم"],
    specs: [["العلامة", "My Way"], ["النوع", "مطهر ومنظف"]]
  },
  {
    id: 73, category: "cleaning", brand: "My Way", name: "برايت 5 في 1 - منظف ومطهر بالليمون",
    price: 62, oldPrice: 90, emoji: "🍋", image: "images/bright-5in1.jpg", images: ["images/bright-5in1.jpg"], badge: "خصم 28 ج", inStock: true,
    desc: "منظف ومطهر متعدد الاستخدامات برائحة الليمون، عبوة 660 مل.",
    details: "Bright 5 في 1 منظف ومطهر متعدد الاستخدامات بلمعة تدوم طويلاً وبرائحة الليمون، عبوة 660 مل.",
    features: ["5 في 1", "لمعة تدوم طويلاً", "برائحة الليمون", "660 مل"],
    specs: [["العلامة", "My Way"], ["الحجم", "660 مل"]]
  }
];


// ============================================================
//  أكواد الخصم
//  code:     الكود اللي العميل بيكتبه (مش فارق حروف كبيرة ولا صغيرة)
//  type:     "percent" = نسبة مئوية، "fixed" = مبلغ ثابت بالجنيه
//  value:    قيمة الخصم (10 = 10% لو percent، أو 10 جنيه لو fixed)
//  minOrder: (اختياري) أقل إجمالي منتجات عشان الكود يشتغل، 0 = من غير حد أدنى
//  expires:  (اختياري) آخر يوم للكود بالشكل "2026-12-31"
//  active:   (اختياري) اكتب false لو عايز توقف الكود من غير ما تمسحه
//  الخصم بيتحسب على إجمالي المنتجات في السلة، ومش بيشمل رسوم التوصيل.
//  دي أكواد تجريبية، بدّلها بأكوادك.
// ============================================================
//  public: false = الكود مش بيظهر في صفحة العروض (بيفضل شغال لو العميل كتبه)
const COUPONS = [
  { code: "WELCOME10", type: "percent", value: 10, minOrder: 0 },
  { code: "SAVE50", type: "fixed", value: 50, minOrder: 300 },
  { code: "WINTER20", type: "percent", value: 20, minOrder: 500, expires: "2026-12-31" }
];


// ============================================================
//  سلسلة الطلبات (ستريك): كل ما العميل يطلب في يوم جديد رسوم التوصيل بتقل
//  fees:       رسوم التوصيل في اليوم 1 و2 و3... وآخر رقم هو السقف (0 = مجاني)
//  minOrder:   أقل إجمالي منتجات عشان الطلب يدخل في السلسلة ويخد خصمها
//  maxGapDays: أقصى فرق بين طلبين عشان السلسلة تكمّل (2 = مسموح يفوّت يوم واحد)
//  السلسلة محفوظة في متصفح العميل، وبتتأكد منها من رسالة الواتساب (فيها يوم السلسلة وتاريخ آخر طلب).
// ============================================================
const STREAK = {
  fees: [20, 15, 10, 5, 0],
  minOrder: 50,
  maxGapDays: 2
};

// ============================================================
//  توصيل مجاني في مواعيد محددة لمناطق معينة (المدينة الجامعية)
//  areas:         أسماء المناطق (لازم تطابق اللي في STORE.areas بالظبط)
//  times:         مواعيد التوصيل المجاني بنظام 24 ساعة، "16:00" = 4 مساءً
//  leadMinutes:   لازم الطلب يتبعت قبل الميعاد بالمدة دي على الأقل (بالدقايق)
//  العميل بيختار ميعاد من المواعيد دي فالتوصيل بيبقى مجاني، أو "أقرب وقت" بالرسوم العادية.
// ============================================================
const FREE_SLOTS = {
  areas: ["المدينة الجامعية بنات", "المدينة الجامعية شباب"],
  times: ["16:00", "20:00"],
  leadMinutes: 60
};


// ============================================================
//  البانرز الإعلانية (بتظهر فوق في الصفحة الرئيسية وبتتحرك لوحدها)
//  title / text: الكلام اللي على البانر     cta: كلمة الزرار
//  icon:         اسم أيقونة من القايمة اللي في أول index.html (مثلاً gift, bolt, tag, perfume)
//  style:        "navy" كحلي  |  "orange" برتقالي
//  image:        صورة بانر جاهزة (اختياري)، مثلاً "images/banner1.jpg" (لو حطيتها بتظهر بدل التصميم)
//  go:           الضغط على البانر بيودّي فين:
//                  { cat: "perfumes" }  = يفتح تصنيف      { brand: "My Way" } = يفتح براند
//                  { info: "streak" } = يفتح شرح الستريك
//                  { product: 6 } = يفتح منتج              { coupon: "WELCOME10" } = ينسخ الكود ويطبّقه في السلة
// ============================================================
const BANNERS = [
  { title: "أفضل العروض على العطور", text: "برفانات My Way بأسعار تبدأ من 140 ج", cta: "تسوق العطور", icon: "perfume", style: "navy", go: { cat: "perfumes" } },
  { title: "كل يوم توصيل أرخص", text: "اطلب كل يوم والتوصيل يوصل لمجاني", cta: "اعرف أكتر", icon: "bolt", style: "orange", go: { info: "streak" } },
  { title: "خصم 10% على طلبك", text: "استخدم كود WELCOME10", cta: "طبّق الكود", icon: "gift", style: "navy", go: { coupon: "WELCOME10" } }
];

// ============================================================
//  الأكثر مبيعاً (الصف المتحرك تحت التصنيفات): اكتب أرقام (id) المنتجات بالترتيب
// ============================================================
const BEST_SELLERS = [58, 30, 24, 31, 35, 37, 41, 12];

// ============================================================
//  تسوق بالبراند: name لازم يطابق brand في المنتج (أو vendor للملابس)
//  logo: صورة لوجو البراند (اختياري) مثلاً "images/brand-myway.png"، ولو فاضية بيظهر icon
// ============================================================
const BRANDS = [
  { name: "My Way", icon: "star", logo: "" },
  { name: "العبدلله", icon: "shirt", logo: "" }
];

// ============================================================
//  منتجات مخبّية مؤقتاً لأنها لسه ملهاش صور (مش بتظهر في الموقع)
//  لما تجيب صورة المنتج: انقل المنتج ده جوه PRODUCTS فوق، وحط الصورة في image: و images:
//  (كل المنتجات دي موجودة هنا بالأرقام والأسعار القديمة)
// ============================================================
/*
  {
    id: 1, category: "notebooks", name: "كشكول سلك A4 - 100 ورقة",
    price: 35, oldPrice: 0, emoji: "📓", image: "", images: [], badge: "", inStock: true,
    desc: "ورق ناعم وغلاف قوي، مناسب للمذاكرة والشغل.",
    details: "كشكول سلك بحجم A4 مناسب للمحاضرات والمذاكرة اليومية. الورق ناعم على القلم والتجليد السلك بيسمح تفتحه 360 درجة وتشتغل عليه بسهولة.",
    features: ["ورق ناعم مناسب للأقلام الجاف والرصاص", "تجليد سلك بيتفتح بالكامل", "غلاف قوي مقاوم للتمزق"],
    specs: [["الحجم", "A4"], ["عدد الأوراق", "100 ورقة"], ["نوع الخطوط", "مسطر"]]
  },
  {
    id: 2, category: "notebooks", name: "Notebook هارد كفر - خطوط",
    price: 85, oldPrice: 100, emoji: "📔", image: "", images: [], badge: "خصم", inStock: true,
    desc: "Notebook بغلاف سميك، 120 ورقة بخطوط مريحة للعين.",
    details: "Notebook بغلاف هارد كفر سميك بيحمي الأوراق وبيستحمل الشنطة والاستخدام اليومي. الخطوط خفيفة ومريحة للعين، ومناسب للملاحظات والشغل.",
    features: ["غلاف هارد كفر سميك", "خطوط خفيفة مريحة للعين", "شريطة لتحديد الصفحة"],
    specs: [["الحجم", "A5"], ["عدد الأوراق", "120 ورقة"], ["الغلاف", "هارد كفر"]]
  },
  {
    id: 3, category: "notebooks", name: "Sketchbook للرسم",
    price: 120, oldPrice: 0, emoji: "🎨", image: "", images: [], badge: "جديد", inStock: true,
    desc: "ورق سميك مناسب للرصاص والألوان الخشب.",
    details: "Sketchbook بورق سميك بيستحمل الرصاص والفحم والألوان الخشب من غير ما يتشرّب أو يتخرم. مناسب للمبتدئين والمحترفين.",
    features: ["ورق سميك بدون خطوط", "مناسب للرصاص والفحم والألوان الخشب", "تجليد متين"],
    specs: [["الحجم", "A4"], ["عدد الأوراق", "60 ورقة"], ["وزن الورق", "150 جرام"]]
  },
  {
    id: 4, category: "planners", name: "Planner يومي 2027",
    price: 150, oldPrice: 0, emoji: "📒", image: "", images: [], badge: "جديد", inStock: true,
    desc: "مفكرة منظمة بالأيام والأسابيع مع صفحات للأهداف.",
    details: "Planner منظم بيساعدك تتابع يومك وأسبوعك وأهدافك. فيه صفحات للتخطيط الشهري وقوايم المهام وملاحظات في الآخر.",
    features: ["تخطيط يومي وأسبوعي وشهري", "صفحات للأهداف وقوايم المهام", "غلاف أنيق ومتين"],
    specs: [["السنة", "2027"], ["الحجم", "A5"], ["الغلاف", "هارد كفر"]]
  },
  {
    id: 5, category: "planners", name: "مذكرة جيب صغيرة",
    price: 45, oldPrice: 0, emoji: "📝", image: "", images: [], badge: "", inStock: true,
    desc: "حجم صغير تحطه في جيبك أو شنطتك بسهولة.",
    details: "مذكرة صغيرة الحجم تخليك تسجل أي فكرة أو رقم في أي وقت. خفيفة وسهل تتشال في الجيب أو الشنطة.",
    features: ["حجم جيب خفيف", "ورق مسطر", "مناسبة للملاحظات السريعة"],
    specs: [["الحجم", "A6"], ["عدد الأوراق", "80 ورقة"]]
  },
  {
    id: 6, category: "perfumes", name: "عطر رجالي - Oud Royal",
    price: 350, oldPrice: 400, emoji: "🧴", image: "", images: [], badge: "خصم", inStock: true,
    desc: "عطر شرقي ثابت، حجم 100 مل.",
    details: "عطر رجالي بطابع شرقي دافئ ورائحة عود واضحة. مناسب للمناسبات والسهرات وبيثبت لساعات طويلة.",
    features: ["رائحة شرقية دافئة", "ثبات عالي", "مناسب للمناسبات"],
    specs: [["الحجم", "100 مل"], ["النوع", "رجالي"], ["العائلة العطرية", "شرقي / عود"]]
  },
  {
    id: 7, category: "perfumes", name: "عطر حريمي - Rose Touch",
    price: 320, oldPrice: 0, emoji: "🌹", image: "", images: [], badge: "", inStock: true,
    desc: "رائحة زهرية ناعمة ومناسبة للاستخدام اليومي، حجم 100 مل.",
    details: "عطر حريمي برائحة زهرية ناعمة وخفيفة، مناسب للاستخدام اليومي والخروجات. رقيق من غير ما يكون تقيل.",
    features: ["رائحة زهرية ناعمة", "مناسب للاستخدام اليومي", "زجاجة أنيقة تنفع هدية"],
    specs: [["الحجم", "100 مل"], ["النوع", "حريمي"], ["العائلة العطرية", "زهري"]]
  },
  {
    id: 8, category: "bags", name: "شنطة ظهر Backpack للجامعة",
    price: 450, oldPrice: 0, emoji: "🎒", image: "", images: [], badge: "", inStock: true,
    desc: "مساحة واسعة وجيب للابتوب، خامة مقاومة للمية.",
    details: "Backpack عملية للجامعة والشغل، فيها أكتر من جيب لتنظيم الحاجات وجيب مبطن للابتوب. الخامة مقاومة للمية والحمالات مريحة للظهر.",
    features: ["جيب مبطن للابتوب", "خامة مقاومة للمية", "حمالات مريحة للظهر", "جيوب متعددة للتنظيم"],
    specs: [["الخامة", "قماش مقاوم للمية"], ["مناسبة للابتوب", "حتى 15.6 بوصة"], ["عدد الجيوب", "4"]]
  },
  {
    id: 9, category: "bags", name: "شنطة كتف Tote Bag",
    price: 180, oldPrice: 0, emoji: "👜", image: "", images: [], badge: "", inStock: true,
    desc: "شنطة قماش عملية للخروجات واليوم الدراسي.",
    details: "Tote Bag قماش عملية وخفيفة، بتشيل كتب وحاجات اليوم من غير ما تتعب كتفك. مناسبة للجامعة والخروجات.",
    features: ["قماش متين وخفيف", "مساحة واسعة", "سهلة الغسيل"],
    specs: [["الخامة", "قماش"], ["الاستخدام", "كتف"]]
  },
  {
    id: 10, category: "bags", name: "شنطة لاب توب Sleeve",
    price: 220, oldPrice: 0, emoji: "💼", image: "", images: [], badge: "", inStock: false,
    desc: "حماية ممتازة للابتوب حتى 15.6 بوصة.",
    details: "Sleeve مبطنة بتحمي الابتوب من الخبطات والخدوش. رفيعة وسهل تتحط جوه أي شنطة.",
    features: ["بطانة واقية من الخبطات", "رفيعة وخفيفة", "سوستة متينة"],
    specs: [["المقاس", "حتى 15.6 بوصة"], ["الخامة", "نيوبرين"]]
  },
  {
    id: 43, category: "fatafeet", name: "لبان",
    price: 5, oldPrice: 0, emoji: "🍬", image: "", images: [], badge: "", inStock: true,
    desc: "لبان بنكهات متنوعة.",
    details: "لبان بنكهات متنوعة، تضيفه على طلبك بسهولة.",
    features: [],
    specs: []
  },
  {
    id: 44, category: "fatafeet", name: "ملبس",
    price: 5, oldPrice: 0, emoji: "🍭", image: "", images: [], badge: "", inStock: true,
    desc: "ملبس حلو ومقرمش.",
    details: "ملبس بألوان ونكهات مختلفة، حلو وخفيف.",
    features: [],
    specs: []
  },
  {
    id: 45, category: "fatafeet", name: "مناديل",
    price: 10, oldPrice: 0, emoji: "🧻", image: "", images: [], badge: "", inStock: true,
    desc: "مناديل ورقية جيب.",
    details: "علبة مناديل ورقية ناعمة وخفيفة.",
    features: [],
    specs: []
  }
*/


// ============================================================
//  عروض بلاك فرايداي (أو أي عروض تانية): قسم العروض + بانر في الرئيسية
//  name:     اسم قسم العروض (غيّره في أي وقت: "عروض الشتا" / "عروض رمضان"...)
//  tagline:  الجملة الكبيرة على البانر
//  until:    آخر يوم للعروض بالشكل سنة-شهر-يوم (بيشمل اليوم ده). بعده العروض والبانر بيختفوا والأسعار ترجع لأصلها
//  items:    المنتجات المخفّضة: id المنتج + percent نسبة الخصم (الموقع بيحسب السعر الجديد لوحده)
//            [مؤقت] النسب دي تجريبية، عدّلها زي ما تحب (الحد الأقصى المعلن في tagline = 70%)
// ============================================================
const OFFER = {
  name: "عروض بلاك فرايداي",
  tagline: "خصومات تصل إلى 70%",
  until: "2026-11-11",
  items: [
    { id: 42, percent: 70 },
    { id: 58, percent: 50 },
    { id: 37, percent: 30 },
    { id: 24, percent: 25 }
  ]
};

// ============================================================
//  المقترحات (الكلمة التانية في الهيدر): أرقام (id) المنتجات بالترتيب
// ============================================================
const SUGGESTED = [23, 25, 26, 30, 31, 33, 35, 37, 39, 41, 12, 15];

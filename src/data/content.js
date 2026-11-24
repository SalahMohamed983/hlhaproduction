import { Film, Sparkles, Compass, MonitorSmartphone } from 'lucide-react';

export const services = [
  {
    id: 'film',
    number: '01',
    title: 'إنتاج الفيديو والريلز',
    short: 'نصوّر الفكرة حتى آخر كادر.',
    detail:
      'تصوير احترافية للفيديوهات والريلز والمنتجات والمحلات والإعلانات.',
    icon: Film,
  },
  {
    id: 'social',
    number: '02',
    title: 'إدارة الصفحات والمحتوي',
    short: 'محتوى يُرى ويُتذكّر.',
    detail:
"ادارة صفحات التواصل الاجتماعي، والرد على الرسائل، وتصميم البوسترات والصور، وإنشاء وكتابة المنشورات."
,    icon: Sparkles,
  },
  {
    id: 'photo',
    number: '03',
    title: 'التصوير الفوتوغرافي',
    short: 'لقطة فيها روح المكان.',
    detail:
      'تصوير منتجات، أزياء، طعام وبورتريه بإضاءة مدروسة وتفاصيل صادقة. لا نطارد الكمال المصطنع؛ نبحث عن اللحظة التي تشبهك.',
    icon: Compass,
  },
  {
    id: 'digital',
    number: '04',
    title: 'المواقع والتطبيقات',
    short: 'تجربة رقمية تمشي معك.',
    detail:
      'نحوّل شخصية المشروع إلى مواقع وتطبيقات واضحة، سريعة، ومصممة لتجعل كل نقرة بداية علاقة، لا مجرد صفحة أخرى على الإنترنت.',
    icon: MonitorSmartphone,
  },
];

export const videoWorks = [
  {
    id: 'sirocco',
    title: 'عمل فيديو 01',
    details: 'لقطة قصيرة من أرشيف هلها.',
    className: 'video-1',
    src: '/video/1788685717360-r3hc5f.mp4',
    image: '',
  },
  {
    id: 'bayt',
    title: 'عمل فيديو 02',
    details: 'لقطة قصيرة من أرشيف هلها.',
    className: 'video-2',
    src: '/video/1788814285055-b1dk7d.mp4',
    image: '',
  },
  {
    id: 'nomad',
    title: 'عمل فيديو 03',
    details: 'لقطة قصيرة من أرشيف هلها.',
    className: 'video-3',
    src: '/video/1788815915320-0b8ipf.mp4',
    image: '',
  },
  {
    id: 'khayma',
    title: 'عمل فيديو 04',
    details: 'لقطة قصيرة من أرشيف هلها.',
    className: 'video-4',
    src: '/video/1788815975401-1g5k6r.mp4',
    image: '',
  },
  {
    id: 'wadi',
    title: 'عمل فيديو 05',
    details: 'لقطة قصيرة من أرشيف هلها.',
    className: 'video-5',
    src: '/video/1788816353326-jv6nm.mp4',
    image: '',
  },
];

export const creators = [
  {
    id: 'adel',
    name: 'عادل',
    niche: 'أسلوب وحضور',
    followers: '—',
    label: 'حضور هادئ وصورة لها طابع',
    className: 'creator-1',
    image: '/Images/1788226481371_1e639c98_62cf_40ad_b550_15200da50a7b.webp',
    description: 'صانع محتوى يهتم بالتفاصيل، الإضاءة، والحضور البصري الذي يبقى في الذاكرة.',
  },
  {
    id: 'moaz',
    name: 'معاذ',
    niche: 'حديث وكاميرا',
    followers: '—',
    label: 'صوت قريب من الناس',
    className: 'creator-2',
    image: '/Images/1788226498435_WhatsApp_Image_2026_08_31_at_9.30.54_PM.webp',
    description: 'يقدّم المحتوى بصدق ووضوح، ويجعل الكاميرا مساحة للحديث لا للاستعراض.',
  },
  {
    id: 'hamza',
    name: 'حمزة',
    niche: 'طاقة يومية',
    followers: '—',
    label: 'حركة وضوء وشارع',
    className: 'creator-3',
    image: '/Images/1788340426787_cropped.webp',
    description: 'يحب المشاهد الحية، والقصص التي تبدأ من الشارع وتنتهي عند الجمهور.',
  },
  {
    id: 'habiba',
    name: 'حبيبة',
    niche: 'جمال وأسلوب',
    followers: '—',
    label: 'أناقة تشبه صاحبتها',
    className: 'creator-4',
    image: '/Images/1788340327682_cropped.webp',
    description: 'صوت هادئ في عالم الصورة، يختار اللون والإطار كما يختار كلماته.',
  },
  {
    id: 'yasser',
    name: 'ياسر',
    niche: 'سفر وحضور',
    followers: '—',
    label: 'لحظة فيها ضوء',
    className: 'creator-5',
    image: '/Images/1788226510379_IMG_20260703_WA0026.jpg.webp',
    description: 'يلتقط الإيقاع الهادئ للأماكن والوجوه، ويعيد روايتها بعدسة دافئة.',
  },
];

/** أسعار مؤقتة — عدّلها من هنا */
export const orderPrices = {
  bloggerVideo: 7150,
  app: 32500,
  website: 13000,
  menu: 6500,
  photoSession: 1300,
  contentWriterDesign: 4680,
  pageManagement: 2600,
};

export const contentWriterMin = 8;

export const digitalProducts = [
  {
    id: 'app',
    title: 'تطبيق',
    hint: 'تجربة على الموبايل',
    priceKey: 'app',
  },
  {
    id: 'website',
    title: 'موقع إلكتروني',
    hint: 'واجهة سريعة وواضحة',
    priceKey: 'website',
  },
  {
    id: 'menu',
    title: 'منيو إلكتروني',
    hint: 'قائمة تُفتح في ثانية',
    priceKey: 'menu',
  },
];

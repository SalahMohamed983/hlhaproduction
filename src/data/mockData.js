export const SPECIALTIES = [
  { id: 1, nameAr: 'مونتير فيديو', nameEn: 'VIDEO_EDITOR' },
  { id: 2, nameAr: 'مصمم جرافيك', nameEn: 'GRAPHIC_DESIGNER' },
  { id: 3, nameAr: 'مطور مواقع', nameEn: 'WEB_DEVELOPER' },
];

export const SERVICE_CATEGORIES = [
  { id: 1, nameAr: 'تصوير فيديو', nameEn: 'Video Production', sortOrder: 1 },
  { id: 2, nameAr: 'تصميم جرافيك', nameEn: 'Graphic Design', sortOrder: 2 },
  { id: 3, nameAr: 'تطوير موقع', nameEn: 'Web Development', sortOrder: 3 },
  { id: 4, nameAr: 'تصميم هوية', nameEn: 'Brand Identity', sortOrder: 4 },
  { id: 5, nameAr: 'إنتاج محتوى', nameEn: 'Content Production', sortOrder: 5 },
];

export const EQUIPMENT_CATEGORIES = [
  { id: 1, nameAr: 'كاميرات', nameEn: 'Cameras' },
  { id: 2, nameAr: 'عدسات', nameEn: 'Lenses' },
  { id: 3, nameAr: 'إضاءة', nameEn: 'Lighting' },
  { id: 4, nameAr: 'صوتيات', nameEn: 'Audio' },
  { id: 5, nameAr: 'درون', nameEn: 'Drones' },
  { id: 6, nameAr: 'إكسسوارات', nameEn: 'Accessories' },
];

export const JOB_TITLES = {
  VIDEO_EDITOR: 'مونتير فيديو',
  GRAPHIC_DESIGNER: 'مصمم جرافيك',
  WEB_DEVELOPER: 'مطور مواقع',
};

const emp = (id, nameAr, nameEn, email, username, specEn, specId, hourly, employment, join, attend, absent, base, net) => ({
  id, nameAr, name: nameAr, nameEn, email, username, password: 'demo1234',
  role: 'EMPLOYEE', specialty: specEn, specialtyId: specId, hourlyRate: hourly, dailyRate: hourly * 8,
  employment, employmentStatus: employment, joinDate: join, isActive: employment === 'working',
  attendanceDays: attend, absenceDays: absent, baseSalary: base, netSalary: net, avatar: null, status: 'active',
});

export const USERS = [
  { id: 1, nameAr: 'سارة الأحمد', name: 'سارة الأحمد', nameEn: 'Sara Al-Ahmad', email: 'sara@hala-media.sa', username: 'sara', password: 'demo1234', role: 'ADMIN', avatar: null, joinDate: '2024-01-15', status: 'active', employment: 'working', employmentStatus: 'working', isActive: true },
  emp(3, 'نورة السالم', 'Noura Al-Salem', 'noura@hala-media.sa', 'noura', 'VIDEO_EDITOR', 1, 75, 'working', '2024-02-10', 19, 1, 6000, 5700),
  emp(4, 'أحمد الزهراني', 'Ahmed Al-Zahrani', 'ahmed@hala-media.sa', 'ahmed', 'GRAPHIC_DESIGNER', 2, 65, 'working', '2024-04-05', 18, 2, 5000, 4500),
  emp(5, 'لينا القحطاني', 'Lina Al-Qahtani', 'lina@hala-media.sa', 'lina', 'WEB_DEVELOPER', 3, 90, 'working', '2024-01-20', 20, 0, 7500, 7500),
  emp(6, 'فهد المطيري', 'Fahad Al-Mutairi', 'fahad@hala-media.sa', 'fahad', 'VIDEO_EDITOR', 1, 70, 'working', '2024-05-12', 17, 3, 5500, 4675),
  emp(7, 'ريم العتيبي', 'Reem Al-Otaibi', 'reem@hala-media.sa', 'reem', 'GRAPHIC_DESIGNER', 2, 60, 'working', '2024-06-01', 16, 4, 4500, 3600),
  emp(8, 'محمود الشمري', 'Mahmoud Al-Shammari', 'mahmoud@hala-media.sa', 'mahmoud', 'GRAPHIC_DESIGNER', 2, 62, 'dismissed', '2024-07-15', 8, 2, 4800, 3840),
  emp(9, 'عمر الحارثي', 'Omar Al-Harthy', 'omar@hala-media.sa', 'omar', 'VIDEO_EDITOR', 1, 72, 'working', '2024-08-01', 18, 2, 5800, 5220),
];

export const DEMO_ACCOUNTS = {
  ADMIN: { id: 1, name: 'سارة الأحمد', nameAr: 'سارة الأحمد', role: 'ADMIN', email: 'sara@hala-media.sa', username: 'sara' },
  EMPLOYEE: { id: 3, name: 'نورة السالم', nameAr: 'نورة السالم', role: 'EMPLOYEE', specialty: 'VIDEO_EDITOR', specialtyId: 1, email: 'noura@hala-media.sa', username: 'noura' },
  EMPLOYEE_u4: { id: 4, name: 'أحمد الزهراني', nameAr: 'أحمد الزهراني', role: 'EMPLOYEE', specialty: 'GRAPHIC_DESIGNER', specialtyId: 2, email: 'ahmed@hala-media.sa', username: 'ahmed' },
  EMPLOYEE_u6: { id: 6, name: 'فهد المطيري', nameAr: 'فهد المطيري', role: 'EMPLOYEE', specialty: 'VIDEO_EDITOR', specialtyId: 1, email: 'fahad@hala-media.sa', username: 'fahad' },
  EMPLOYEE_u7: { id: 7, name: 'ريم العتيبي', nameAr: 'ريم العتيبي', role: 'EMPLOYEE', specialty: 'GRAPHIC_DESIGNER', specialtyId: 2, email: 'reem@hala-media.sa', username: 'reem' },
  EMPLOYEE_u8: { id: 8, name: 'محمود الشمري', nameAr: 'محمود الشمري', role: 'EMPLOYEE', specialty: 'GRAPHIC_DESIGNER', specialtyId: 2, email: 'mahmoud@hala-media.sa', username: 'mahmoud' },
  EMPLOYEE_u9: { id: 9, name: 'عمر الحارثي', nameAr: 'عمر الحارثي', role: 'EMPLOYEE', specialty: 'VIDEO_EDITOR', specialtyId: 1, email: 'omar@hala-media.sa', username: 'omar' },
};

export const KANBAN_COLUMNS = [
  { id: 'new_lead', label: 'طلب جديد', color: '#64748b' },
  { id: 'in_production', label: 'قيد التنفيذ', color: '#F59E0B' },
  { id: 'internal_qa', label: 'مراجعة الجودة', color: '#8B5CF6' },
  { id: 'client_review', label: 'مراجعة العميل', color: '#F97316' },
  { id: 'completed', label: 'مكتمل', color: '#10B981' },
];

export const SERVICE_KIND_LABELS = {
  video_shoot: 'تصوير فيديو',
  social_media: 'إنتاج محتوى',
  software: 'تطوير موقع',
  blogger_ad: 'إعلان بلوجر',
  photo_session: 'جلسة تصوير',
  product_shoot: 'تصوير منتجات',
};

export const SERVICE_KIND_COLORS = {
  video_shoot: '#F59E0B',
  social_media: '#F97316',
  software: '#3B82F6',
  blogger_ad: '#8B5CF6',
  photo_session: '#10B981',
  product_shoot: '#06B6D4',
};

export const SERVICE_COLORS = {
  'تصوير فيديو': '#F59E0B', 'تصميم جرافيك': '#8B5CF6', 'تطوير موقع': '#3B82F6',
  'تصميم هوية': '#10B981', 'إنتاج محتوى': '#F97316',
};

export const SERVICE_SPECIALTY_MAP = {
  'تصوير فيديو': 'VIDEO_EDITOR',
  'تصميم جرافيك': 'GRAPHIC_DESIGNER',
  'تطوير موقع': 'WEB_DEVELOPER',
  'إنتاج محتوى': 'GRAPHIC_DESIGNER',
  'تصميم هوية': 'GRAPHIC_DESIGNER',
};

export const SERVICES_CATALOG = [
  { id: 1, categoryId: 1, kind: 'video_shoot', billingType: 'one_time', nameAr: 'تصوير فيديو', name: 'تصوير فيديو', nameEn: 'Video Production', details: '', basePrice: 5000, isEnabled: true, enabled: true, iconKey: 'Video', icon: 'Video' },
  { id: 2, categoryId: 2, kind: 'software', billingType: 'one_time', nameAr: 'تصميم جرافيك', name: 'تصميم جرافيك', nameEn: 'Graphic Design', details: '', basePrice: 1500, isEnabled: true, enabled: true, iconKey: 'Palette', icon: 'Palette' },
  { id: 3, categoryId: 3, kind: 'software', billingType: 'one_time', nameAr: 'تطوير موقع', name: 'تطوير موقع', nameEn: 'Web Development', details: '', basePrice: 8000, isEnabled: true, enabled: true, iconKey: 'Code', icon: 'Code' },
  { id: 4, categoryId: 4, kind: 'software', billingType: 'one_time', nameAr: 'تصميم هوية', name: 'تصميم هوية', nameEn: 'Brand Identity', details: '', basePrice: 4500, isEnabled: true, enabled: true, iconKey: 'Briefcase', icon: 'Briefcase' },
  { id: 5, categoryId: 5, kind: 'social_media', billingType: 'monthly', nameAr: 'إنتاج محتوى', name: 'إنتاج محتوى', nameEn: 'Content Production', details: '', basePrice: 2000, isEnabled: true, enabled: true, iconKey: 'FileText', icon: 'FileText' },
  { id: 6, categoryId: 1, kind: 'blogger_ad', billingType: 'one_time', nameAr: 'إعلان بلوجر', name: 'إعلان بلوجر', nameEn: 'Blogger Ad', details: '', basePrice: 7150, isEnabled: true, enabled: true, iconKey: 'Megaphone', icon: 'Megaphone' },
  { id: 7, categoryId: 1, kind: 'photo_session', billingType: 'one_time', nameAr: 'جلسة تصوير فوتوغرافي', name: 'جلسة تصوير فوتوغرافي', nameEn: 'Photo Session', details: '', basePrice: 1300, isEnabled: true, enabled: true, iconKey: 'Camera', icon: 'Camera' },
];

const asg = (employeeId, assignedAt = '2026-09-01T10:00:00Z') => ({
  employeeId, assignedAt, deliverableType: null, deliverableLink: null, employeeNotes: '',
});

const order = (o) => ({
  ...o,
  service: o.serviceNameAr,
  assignments: o.assignments || [],
  agreedPrice: o.agreedPrice,
  bloggerId: o.bloggerId ?? null,
  photoPackageId: o.photoPackageId ?? null,
  digitalProductId: o.digitalProductId ?? null,
  subscriptionStart: o.subscriptionStart ?? null,
  subscriptionEnd: o.subscriptionEnd ?? null,
  adminNotes: o.adminNotes ?? '',
});

export const ORDERS = [
  order({ id: 1, clientId: 1, clientName: 'شركة النخيل للتجزئة', clientPhone: '0501234567', companyName: 'النخيل للتجزئة', serviceId: 1, serviceKind: 'video_shoot', serviceNameAr: 'تصوير فيديو', agreedPrice: 8500, status: 'in_production', assignments: [asg(3), asg(6)], dueDate: '2026-09-28', createdAt: '2026-09-01', priority: 'high', description: 'إنتاج 3 فيديوهات تسويقية لمنتجات الموسم الجديد' }),
  order({ id: 2, clientId: 2, clientName: 'مطعم البيت العربي', clientPhone: '0557654321', companyName: 'البيت العربي', serviceId: 2, serviceKind: 'software', serviceNameAr: 'تصميم جرافيك', agreedPrice: 12000, status: 'client_review', assignments: [asg(4, '2026-08-20T10:00:00Z')], dueDate: '2026-09-25', createdAt: '2026-08-20', priority: 'urgent', description: 'مواد تصميم إعلانية متكاملة للمطعم' }),
  order({ id: 3, clientId: 3, clientName: 'مجوهرات ليلى', clientPhone: '0509876543', companyName: 'مجوهرات ليلى', serviceId: 4, serviceKind: 'software', serviceNameAr: 'تصميم هوية', agreedPrice: 5500, status: 'new_lead', assignments: [], dueDate: '2026-10-15', createdAt: '2026-09-19', priority: 'medium', description: 'تصميم هوية بصرية كاملة: شعار وبطاقات وأكياس' }),
  order({ id: 4, clientId: 4, clientName: 'عيادة الأسنان التخصصية', clientPhone: '0512345678', companyName: 'عيادة الأسنان', serviceId: 3, serviceKind: 'software', serviceNameAr: 'تطوير موقع', agreedPrice: 15000, status: 'in_production', assignments: [asg(5, '2026-09-05T10:00:00Z')], dueDate: '2026-10-30', createdAt: '2026-09-05', priority: 'high', description: 'موقع إلكتروني متكامل مع نظام حجز المواعيد' }),
  order({ id: 5, clientId: 5, clientName: 'أكاديمية الكود للتعليم', clientPhone: '0534567890', companyName: 'أكاديمية الكود', serviceId: 5, serviceKind: 'social_media', serviceNameAr: 'إنتاج محتوى', agreedPrice: 3200, status: 'completed', assignments: [asg(4, '2026-08-25T10:00:00Z')], dueDate: '2026-09-10', createdAt: '2026-08-25', priority: 'low', description: 'تصميم 20 منشور لمنصات التواصل الاجتماعي', subscriptionStart: '2026-08-25' }),
  order({ id: 6, clientId: 6, clientName: 'سوبرماركت الواحة', clientPhone: '0523456789', companyName: 'الواحة', serviceId: 2, serviceKind: 'software', serviceNameAr: 'تصميم جرافيك', agreedPrice: 4200, status: 'internal_qa', assignments: [asg(4, '2026-09-08T10:00:00Z'), asg(7, '2026-09-08T10:00:00Z'), asg(8, '2026-09-08T10:00:00Z')], dueDate: '2026-09-22', createdAt: '2026-09-08', priority: 'high', description: 'مواد تسويقية: لافتات وفلايرز وقوائم طعام' }),
  order({ id: 7, clientId: 7, clientName: 'شركة التقنية الذكية', clientPhone: '0545678901', companyName: 'التقنية الذكية', serviceId: 3, serviceKind: 'software', serviceNameAr: 'تطوير موقع', agreedPrice: 22000, status: 'in_production', assignments: [], dueDate: '2026-11-20', createdAt: '2026-09-18', priority: 'medium', description: 'منصة SaaS متكاملة مع لوحة تحكم للعملاء' }),
  order({ id: 8, clientId: 8, clientName: 'فندق النجوم الخمس', clientPhone: '0556789012', companyName: 'فندق النجوم', serviceId: 1, serviceKind: 'video_shoot', serviceNameAr: 'تصوير فيديو', agreedPrice: 18000, status: 'in_production', assignments: [asg(3, '2026-09-10T10:00:00Z'), asg(9, '2026-09-10T10:00:00Z')], dueDate: '2026-10-05', createdAt: '2026-09-10', priority: 'urgent', description: 'فيلم ترويجي احترافي للفندق + 10 ريلز' }),
  order({ id: 9, clientId: 9, clientName: 'متجر الورود', clientPhone: '0561112233', companyName: 'متجر الورود', serviceId: 2, serviceKind: 'software', serviceNameAr: 'تصميم جرافيك', agreedPrice: 2800, status: 'cancelled', assignments: [], dueDate: '2026-09-18', createdAt: '2026-09-08', priority: 'low', description: 'تصميم كتالوج موسمي — أُلغي بناءً على طلب العميل', adminNotes: 'تم الإلغاء قبل بدء التنفيذ' }),
];

export const TASKS = [
  { id: 1, title: 'مونتاج الفيديو التسويقي الأول - النخيل', orderId: 1, assignedTo: 3, priority: 'urgent', status: 'in_progress', estimatedHours: 8, loggedHours: 5.5, dueDate: '2026-09-23', deliverableLink: null, notes: 'تم الانتهاء من الخام، الآن في مرحلة التلوين' },
  { id: 2, title: 'تصميم مقدمة الفيديو - النخيل', orderId: 1, assignedTo: 6, priority: 'high', status: 'todo', estimatedHours: 4, loggedHours: 0, dueDate: '2026-09-24', deliverableLink: null, notes: '' },
  { id: 3, title: 'تطوير صفحة الحجز - عيادة الأسنان', orderId: 4, assignedTo: 5, priority: 'high', status: 'in_progress', estimatedHours: 16, loggedHours: 9, dueDate: '2026-10-10', deliverableLink: 'https://github.com/hala-media/dental-website', notes: 'الـ API للحجز جاهز' },
  { id: 4, title: 'تصميم منشورات انستغرام - الواحة', orderId: 6, assignedTo: 4, priority: 'high', status: 'in_review', estimatedHours: 6, loggedHours: 6, dueDate: '2026-09-21', deliverableLink: 'https://figma.com/file/abc123', notes: 'جاهز للمراجعة، 12 منشور مكتمل' },
  { id: 5, title: 'تصميم لافتات خارجية - الواحة', orderId: 6, assignedTo: 7, priority: 'high', status: 'in_progress', estimatedHours: 5, loggedHours: 3, dueDate: '2026-09-22', deliverableLink: null, notes: '' },
  { id: 6, title: 'مونتاج ريلز الفندق - النجوم الخمس', orderId: 8, assignedTo: 3, priority: 'urgent', status: 'todo', estimatedHours: 12, loggedHours: 0, dueDate: '2026-09-30', deliverableLink: null, notes: '' },
  { id: 7, title: 'مونتاج الفيلم الترويجي - النجوم الخمس', orderId: 8, assignedTo: 6, priority: 'urgent', status: 'todo', estimatedHours: 20, loggedHours: 0, dueDate: '2026-10-03', deliverableLink: null, notes: '' },
  { id: 8, title: 'تصميم منشورات أكاديمية الكود', orderId: 5, assignedTo: 4, priority: 'low', status: 'completed', estimatedHours: 8, loggedHours: 7.5, dueDate: '2026-09-10', deliverableLink: 'https://drive.google.com/folder/xyz', notes: 'تم التسليم والموافقة' },
  { id: 9, title: 'تصميم الهوية المرئية - الواحة', orderId: 6, assignedTo: 8, priority: 'high', status: 'in_progress', estimatedHours: 6, loggedHours: 2, dueDate: '2026-09-22', deliverableLink: null, notes: 'العمل على دليل الألوان والخطوط' },
  { id: 10, title: 'مونتاج الريلز الإضافية - النجوم الخمس', orderId: 8, assignedTo: 9, priority: 'urgent', status: 'in_progress', estimatedHours: 10, loggedHours: 4, dueDate: '2026-10-01', deliverableLink: null, notes: 'تم الانتهاء من 4 ريلز' },
];

export const MONTHLY_REVENUE = [
  { month: 'يناير', revenue: 42000, expenses: 28000, profit: 14000 },
  { month: 'فبراير', revenue: 38000, expenses: 25000, profit: 13000 },
  { month: 'مارس', revenue: 55000, expenses: 32000, profit: 23000 },
  { month: 'أبريل', revenue: 61000, expenses: 35000, profit: 26000 },
  { month: 'مايو', revenue: 49000, expenses: 30000, profit: 19000 },
  { month: 'يونيو', revenue: 72000, expenses: 40000, profit: 32000 },
  { month: 'يوليو', revenue: 68000, expenses: 38000, profit: 30000 },
  { month: 'أغسطس', revenue: 83000, expenses: 45000, profit: 38000 },
  { month: 'سبتمبر', revenue: 91000, expenses: 48000, profit: 43000 },
  { month: 'أكتوبر', revenue: 78000, expenses: 42000, profit: 36000 },
  { month: 'نوفمبر', revenue: 95000, expenses: 51000, profit: 44000 },
  { month: 'ديسمبر', revenue: 110000, expenses: 58000, profit: 52000 },
];

export const ORDERS_BY_SERVICE = [
  { name: 'تصوير فيديو', value: 35, color: '#F59E0B' },
  { name: 'تصميم جرافيك', value: 25, color: '#8B5CF6' },
  { name: 'تطوير موقع', value: 20, color: '#3B82F6' },
  { name: 'إنتاج محتوى', value: 8, color: '#10B981' },
  { name: 'تصميم هوية', value: 12, color: '#F97316' },
];

export const EXPENSES = [
  { id: 1, title: 'Adobe Creative Cloud', name: 'Adobe Creative Cloud', category: 'برمجيات', amount: 850, expenseDate: '2026-09-01', date: '2026-09-01', isRecurring: true, recurring: true },
  { id: 2, title: 'Midjourney Pro', name: 'Midjourney Pro', category: 'برمجيات', amount: 300, expenseDate: '2026-09-01', date: '2026-09-01', isRecurring: true, recurring: true },
  { id: 3, title: 'إيجار المكتب', name: 'إيجار المكتب', category: 'مصاريف ثابتة', amount: 8000, expenseDate: '2026-09-01', date: '2026-09-01', isRecurring: true, recurring: true },
  { id: 4, title: 'Frame.io', name: 'Frame.io', category: 'برمجيات', amount: 450, expenseDate: '2026-09-05', date: '2026-09-05', isRecurring: true, recurring: true },
  { id: 5, title: 'معدات تصوير جديدة', name: 'معدات تصوير جديدة', category: 'معدات', amount: 12000, expenseDate: '2026-09-12', date: '2026-09-12', isRecurring: false, recurring: false },
  { id: 6, title: 'Figma Pro', name: 'Figma Pro', category: 'برمجيات', amount: 200, expenseDate: '2026-09-01', date: '2026-09-01', isRecurring: true, recurring: true },
];

export const PAYOUTS = [
  { id: 3, recipient: 'نورة السالم', type: 'موظف', amount: 3750, orderId: 1, status: 'paid', dueDate: '2026-09-15' },
  { id: 4, recipient: 'أحمد الزهراني', type: 'موظف', amount: 2800, orderId: 5, status: 'paid', dueDate: '2026-09-10' },
  { id: 6, recipient: 'فهد المطيري', type: 'موظف', amount: 3200, orderId: 1, status: 'pending', dueDate: '2026-09-30' },
  { id: 7, recipient: 'لينا القحطاني', type: 'موظف', amount: 5600, orderId: 4, status: 'pending', dueDate: '2026-10-05' },
];

export const NOTIFICATIONS = [
  { id: 1, type: 'warning', title: 'طلب متأخر', message: 'طلب مطعم البيت العربي متأخر عن الموعد المحدد', time: '10 دقائق', read: false },
  { id: 2, type: 'info', title: 'طلب جديد', message: 'مجوهرات ليلى أرسلت طلباً جديداً لتصميم الهوية', time: '45 دقيقة', read: false },
  { id: 3, type: 'success', title: 'تم الاستلام', message: 'أكاديمية الكود وافقت على التسليم النهائي', time: '2 ساعة', read: true },
  { id: 4, type: 'warning', title: 'طلب مراجعة', message: 'سوبرماركت الواحة طلب تعديلات على التصميم', time: '3 ساعات', read: true },
  { id: 5, type: 'info', title: 'موظف جديد', message: 'تم إضافة محمود الشمري كمصمم جرافيك', time: 'أمس', read: true },
];

export const DAILY_ATTENDANCE = [
  { date: '2026-09-25', employeeId: 3, status: 'present', checkInTime: '09:05', notes: '' },
  { date: '2026-09-25', employeeId: 4, status: 'late', checkInTime: '09:42', notes: 'ازدحام مروري' },
  { date: '2026-09-25', employeeId: 5, status: 'present', checkInTime: '08:55', notes: '' },
  { date: '2026-09-25', employeeId: 6, status: 'absent', checkInTime: '', notes: 'إجازة مرضية' },
  { date: '2026-09-25', employeeId: 7, status: 'present', checkInTime: '09:10', notes: '' },
  { date: '2026-09-25', employeeId: 8, status: 'on_leave', checkInTime: '', notes: 'إجازة سنوية' },
  { date: '2026-09-25', employeeId: 9, status: 'present', checkInTime: '09:00', notes: '' },
  { date: '2026-09-26', employeeId: 3, status: 'present', checkInTime: '08:58', notes: '' },
  { date: '2026-09-26', employeeId: 4, status: 'present', checkInTime: '09:02', notes: '' },
  { date: '2026-09-26', employeeId: 5, status: 'late', checkInTime: '09:35', notes: '' },
  { date: '2026-09-26', employeeId: 6, status: 'present', checkInTime: '09:08', notes: '' },
  { date: '2026-09-26', employeeId: 7, status: 'absent', checkInTime: '', notes: 'لم يحضر' },
  { date: '2026-09-26', employeeId: 8, status: 'on_leave', checkInTime: '', notes: 'إجازة سنوية' },
  { date: '2026-09-26', employeeId: 9, status: 'present', checkInTime: '09:12', notes: '' },
  { date: '2026-09-27', employeeId: 3, status: 'present', checkInTime: '09:00', notes: '' },
  { date: '2026-09-27', employeeId: 4, status: 'present', checkInTime: '09:04', notes: '' },
  { date: '2026-09-27', employeeId: 5, status: 'present', checkInTime: '08:50', notes: '' },
  { date: '2026-09-27', employeeId: 6, status: 'late', checkInTime: '09:50', notes: 'موعد شخصي' },
  { date: '2026-09-27', employeeId: 7, status: 'present', checkInTime: '09:15', notes: '' },
  { date: '2026-09-27', employeeId: 8, status: 'present', checkInTime: '09:07', notes: '' },
  { date: '2026-09-27', employeeId: 9, status: 'on_leave', checkInTime: '', notes: 'إذن رسمي' },
];

const cl = (id, contactName, companyName, phone, email, status, totalSpent, remainingBalance, totalOrders) => ({
  id, contactName, name: contactName, companyName, company: companyName, phone, email, status, totalSpent, remainingBalance, totalOrders,
});

export const CLIENTS = [
  cl(1, 'خالد النخيل', 'شركة النخيل للتجزئة', '0501234567', 'khaled@nakheel.sa', 'Active', 18500, 4250, 2),
  cl(2, 'منى العربي', 'مطعم البيت العربي', '0557654321', 'mona@alarabi.sa', 'Active', 12000, 5500, 1),
  cl(3, 'ليلى الحسن', 'مجوهرات ليلى', '0509876543', 'layla@jewels.sa', 'Active', 0, 5500, 1),
  cl(4, 'د. سامر العلي', 'عيادة الأسنان التخصصية', '0512345678', 'samir@dental.sa', 'Active', 7500, 6500, 1),
  cl(5, 'طارق الكود', 'أكاديمية الكود للتعليم', '0534567890', 'tariq@codeacademy.sa', 'Inactive', 3200, 0, 1),
  cl(6, 'إدارة الواحة', 'سوبرماركت الواحة', '0523456789', '', 'Active', 2100, 1900, 1),
  cl(7, 'شركة التقنية الذكية', 'التقنية الذكية', '0545678901', '', 'Active', 0, 22000, 1),
  cl(8, 'فندق النجوم الخمس', 'فندق النجوم', '0556789012', '', 'Active', 9000, 9000, 1),
  cl(9, 'متجر الورود', 'متجر الورود', '0561112233', '', 'Inactive', 0, 0, 1),
];

export const EQUIPMENT = [
  { id: 1, name: 'Sony FX3', equipmentCategoryId: 1, category: 'Cameras', serialNumber: 'FX3-8821', status: 'operational' },
  { id: 2, name: 'Canon R5', equipmentCategoryId: 1, category: 'Cameras', serialNumber: 'R5-4410', status: 'checked_out' },
  { id: 3, name: 'Sony 24-70 GM II', equipmentCategoryId: 2, category: 'Lenses', serialNumber: 'GM-2470', status: 'checked_out' },
  { id: 4, name: 'Sigma 35mm Art', equipmentCategoryId: 2, category: 'Lenses', serialNumber: 'SG-35A', status: 'operational' },
  { id: 5, name: 'Aputure 600d Pro', equipmentCategoryId: 3, category: 'Lighting', serialNumber: 'AP-600D', status: 'operational' },
  { id: 6, name: 'Godox SL60', equipmentCategoryId: 3, category: 'Lighting', serialNumber: 'GX-SL60', status: 'maintenance' },
  { id: 7, name: 'Rode Wireless GO II', equipmentCategoryId: 4, category: 'Audio', serialNumber: 'RD-WG2', status: 'checked_out' },
  { id: 8, name: 'DJI Mini 4 Pro', equipmentCategoryId: 5, category: 'Drones', serialNumber: 'DJ-M4P', status: 'operational' },
  { id: 9, name: 'SmallRig Cage FX3', equipmentCategoryId: 6, category: 'Accessories', serialNumber: 'SR-CAGE', status: 'lost' },
  { id: 10, name: 'Tripod Manfrotto 055', equipmentCategoryId: 6, category: 'Accessories', serialNumber: 'MF-055', status: 'operational' },
];

export const EQUIPMENT_RESERVATIONS = [
  { id: 1, equipmentId: 2, orderId: 1, assignedEmployeeId: 3, checkoutDate: '2026-09-20', returnDate: '2026-09-29' },
  { id: 2, equipmentId: 3, orderId: 8, assignedEmployeeId: 9, checkoutDate: '2026-09-22', returnDate: '2026-10-05' },
  { id: 3, equipmentId: 7, orderId: 1, assignedEmployeeId: 3, checkoutDate: '2026-09-20', returnDate: '2026-09-29' },
];

export const ANALYTICS_SUMMARY = {
  monthlyStats: MONTHLY_REVENUE.slice(0, 9),
  serviceProfitability: [
    { name: 'مونتاج فيديو', sales: 18, margin: 42, revenue: 32000 },
    { name: 'حملات المؤثرين', sales: 9, margin: 55, revenue: 21000 },
    { name: 'تطوير مواقع', sales: 6, margin: 38, revenue: 37000 },
    { name: 'تصميم جرافيك', sales: 14, margin: 48, revenue: 16500 },
    { name: 'هوية بصرية', sales: 4, margin: 51, revenue: 14000 },
  ],
  employeeKPIs: [
    { employeeId: 3, name: 'نورة السالم', completedTasks: 11, onTimeRate: 91, avgTurnaround: 2.4 },
    { employeeId: 4, name: 'أحمد الزهراني', completedTasks: 14, onTimeRate: 86, avgTurnaround: 1.8 },
    { employeeId: 5, name: 'لينا القحطاني', completedTasks: 7, onTimeRate: 94, avgTurnaround: 4.1 },
    { employeeId: 6, name: 'فهد المطيري', completedTasks: 9, onTimeRate: 78, avgTurnaround: 3.2 },
    { employeeId: 7, name: 'ريم العتيبي', completedTasks: 8, onTimeRate: 72, avgTurnaround: 2.9 },
    { employeeId: 8, name: 'محمود الشمري', completedTasks: 6, onTimeRate: 88, avgTurnaround: 2.1 },
    { employeeId: 9, name: 'عمر الحارثي', completedTasks: 5, onTimeRate: 80, avgTurnaround: 3.5 },
  ],
};

export const INVOICES = [
  { id: 1, invoiceNumber: 'INV-2026-014', orderId: 1, clientId: 1, clientName: 'شركة النخيل للتجزئة', amount: 8500, paidAmount: 4250, remainingAmount: 4250, paid: 4250, remaining: 4250, dueDate: '2026-09-30', paymentStatus: 'partial', status: 'partial', items: [{ description: 'إنتاج 3 فيديوهات تسويقية', desc: 'إنتاج 3 فيديوهات تسويقية', quantity: 1, qty: 1, unitPrice: 8500, price: 8500 }] },
  { id: 2, invoiceNumber: 'INV-2026-015', orderId: 2, clientId: 2, clientName: 'مطعم البيت العربي', amount: 12000, paidAmount: 6000, remainingAmount: 6000, paid: 6000, remaining: 6000, dueDate: '2026-09-20', paymentStatus: 'overdue', status: 'overdue', items: [{ description: 'مواد تصميم إعلانية', desc: 'مواد تصميم إعلانية', quantity: 1, qty: 1, unitPrice: 12000, price: 12000 }] },
  { id: 3, invoiceNumber: 'INV-2026-016', orderId: 4, clientId: 4, clientName: 'عيادة الأسنان التخصصية', amount: 15000, paidAmount: 7500, remainingAmount: 7500, paid: 7500, remaining: 7500, dueDate: '2026-10-15', paymentStatus: 'partial', status: 'partial', items: [{ description: 'موقع مع نظام حجز', desc: 'موقع مع نظام حجز', quantity: 1, qty: 1, unitPrice: 15000, price: 15000 }] },
  { id: 4, invoiceNumber: 'INV-2026-010', orderId: 5, clientId: 5, clientName: 'أكاديمية الكود للتعليم', amount: 3200, paidAmount: 3200, remainingAmount: 0, paid: 3200, remaining: 0, dueDate: '2026-09-10', paymentStatus: 'paid', status: 'paid', items: [{ description: '20 منشور سوشيال', desc: '20 منشور سوشيال', quantity: 1, qty: 1, unitPrice: 3200, price: 3200 }] },
];

export const CLIENT_PAYMENTS = [
  { id: 1, clientId: 1, invoiceId: 1, paymentDate: '2026-09-02', amount: 4250, method: 'تحويل بنكي' },
  { id: 2, clientId: 2, invoiceId: 2, paymentDate: '2026-08-22', amount: 6000, method: 'تحويل بنكي' },
  { id: 3, clientId: 4, invoiceId: 3, paymentDate: '2026-09-06', amount: 7500, method: 'تحويل بنكي' },
  { id: 4, clientId: 5, invoiceId: 4, paymentDate: '2026-09-10', amount: 3200, method: 'كاش' },
];

export const PAYROLL_MONTH_SETTINGS = [{ yearMonth: '2026-09', workDays: 22 }];

export const EMPLOYEE_PAYROLL_MONTHS = [
  { employeeId: 3, yearMonth: '2026-09', attendanceDays: 19, absenceDays: 1, extraDeductions: 0, extraAdditions: 0, overtimeHours: 0 },
  { employeeId: 4, yearMonth: '2026-09', attendanceDays: 18, absenceDays: 2, extraDeductions: 0, extraAdditions: 0, overtimeHours: 0 },
  { employeeId: 5, yearMonth: '2026-09', attendanceDays: 20, absenceDays: 0, extraDeductions: 0, extraAdditions: 0, overtimeHours: 0 },
  { employeeId: 6, yearMonth: '2026-09', attendanceDays: 17, absenceDays: 3, extraDeductions: 0, extraAdditions: 0, overtimeHours: 0 },
  { employeeId: 7, yearMonth: '2026-09', attendanceDays: 16, absenceDays: 4, extraDeductions: 0, extraAdditions: 0, overtimeHours: 0 },
  { employeeId: 8, yearMonth: '2026-09', attendanceDays: 8, absenceDays: 2, extraDeductions: 0, extraAdditions: 0, overtimeHours: 0 },
  { employeeId: 9, yearMonth: '2026-09', attendanceDays: 18, absenceDays: 2, extraDeductions: 0, extraAdditions: 0, overtimeHours: 0 },
];

export const CONTRACT_TEMPLATES = [
  { id: 1, title: 'اتفاقية إنتاج', type: 'Production Agreement', body: 'اتفاق بين هالة ميديا والعميل لتقديم خدمات الإنتاج البصري وفق الجدول والمخرجات المتفق عليها.' },
  { id: 2, title: 'عقد حملة مؤثرة', type: 'Influencer Campaign Contract', body: 'ينظم التعاون مع صناع المحتوى، عدد القطع، مواعيد النشر، وحقوق الاستخدام.' },
  { id: 3, title: 'عقد ريتينر', type: 'Retainer Contract', body: 'اتفاق شهري لإدارة المحتوى والتصميم بعدد ساعات أو قطع محددة مسبقاً.' },
];

export const assignmentIds = (ord) => (ord.assignments || []).map(a => a.employeeId);

export function enrichOrder(ord, clients, services) {
  const svc = (services || []).find(s => s.id === ord.serviceId);
  const client = (clients || []).find(c => c.id === ord.clientId);
  const serviceNameAr = ord.serviceNameAr ?? svc?.nameAr ?? svc?.name ?? '';
  return {
    ...ord,
    serviceKind: ord.serviceKind ?? svc?.kind,
    serviceNameAr,
    service: ord.service ?? serviceNameAr,
    clientName: ord.clientName ?? client?.contactName ?? client?.name ?? '',
    clientPhone: ord.clientPhone ?? client?.phone ?? '',
    companyName: ord.companyName ?? client?.companyName ?? client?.company ?? '',
  };
}

export function orderPaidRemaining(ord, invoices) {
  const inv = (invoices || []).find(i => i.orderId === ord.id);
  const agreed = ord.agreedPrice ?? 0;
  const paid = inv?.paidAmount ?? inv?.paid ?? 0;
  const remaining = inv?.remainingAmount ?? inv?.remaining ?? Math.max(0, agreed - paid);
  return { agreed, paid, remaining, hasDeposit: paid > 0 };
}

export function specialtyName(specialtyId) {
  const s = SPECIALTIES.find(x => x.id === specialtyId);
  return s?.nameAr ?? JOB_TITLES[specialtyId] ?? '';
}

export function userDisplay(user) {
  if (!user) return '';
  return user.nameAr || user.name || user.fullName || '';
}

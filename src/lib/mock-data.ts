import { Category, MenuItem } from './types';

export const mockCategories: Category[] = [
    { id: 'cat-1', name: 'Main Courses', name_ar: 'الأطباق الرئيسية', sort_order: 1, created_at: '' },
    { id: 'cat-2', name: 'Appetizers', name_ar: 'المقبلات', sort_order: 2, created_at: '' },
    { id: 'cat-3', name: 'Grills', name_ar: 'المشاوي', sort_order: 3, created_at: '' },
    { id: 'cat-4', name: 'Soups', name_ar: 'الشوربات', sort_order: 4, created_at: '' },
    { id: 'cat-5', name: 'Drinks', name_ar: 'المشروبات', sort_order: 5, created_at: '' },
    { id: 'cat-6', name: 'Desserts', name_ar: 'الحلويات', sort_order: 6, created_at: '' },
];

export const mockMenuItems: MenuItem[] = [
    // Main Courses
    {
        id: 'item-1', category_id: 'cat-1',
        name: 'Lamb Mansaf', name_ar: 'منسف لحم',
        description: 'Traditional Iraqi lamb mansaf with saffron rice and yogurt sauce', description_ar: 'منسف لحم عراقي تقليدي مع أرز الزعفران وصلصة اللبن',
        price: 25000, image_url: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600&q=80',
        is_available: true, sort_order: 1, created_at: ''
    },
    {
        id: 'item-2', category_id: 'cat-1',
        name: 'Chicken Tikka', name_ar: 'دجاج تيكا',
        description: 'Marinated chicken grilled to perfection with aromatic spices', description_ar: 'دجاج متبل مشوي بامتياز مع التوابل العطرية',
        price: 18000, image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80',
        is_available: true, sort_order: 2, created_at: ''
    },
    {
        id: 'item-3', category_id: 'cat-1',
        name: 'Iraqi Qozi', name_ar: 'قوزي عراقي',
        description: 'Slow-roasted whole lamb on fragrant basmati rice', description_ar: 'خروف مشوي ببطء على أرز بسمتي عطر',
        price: 35000, image_url: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&q=80',
        is_available: true, sort_order: 3, created_at: ''
    },
    // Appetizers
    {
        id: 'item-4', category_id: 'cat-2',
        name: 'Hummus', name_ar: 'حمص بالطحينة',
        description: 'Creamy hummus with olive oil, paprika and warm bread', description_ar: 'حمص كريمي مع زيت الزيتون والبابريكا والخبز الدافئ',
        price: 5000, image_url: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&q=80',
        is_available: true, sort_order: 1, created_at: ''
    },
    {
        id: 'item-5', category_id: 'cat-2',
        name: 'Fattoush Salad', name_ar: 'سلطة فتوش',
        description: 'Fresh vegetables with crispy bread and pomegranate dressing', description_ar: 'خضروات طازجة مع خبز مقرمش وصلصة الرمان',
        price: 6000, image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
        is_available: true, sort_order: 2, created_at: ''
    },
    {
        id: 'item-6', category_id: 'cat-2',
        name: 'Stuffed Grape Leaves', name_ar: 'ورق عنب محشي',
        description: 'Tender grape leaves stuffed with rice and herbs', description_ar: 'ورق عنب طري محشو بالأرز والأعشاب',
        price: 7500, image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
        is_available: true, sort_order: 3, created_at: ''
    },
    // Grills
    {
        id: 'item-7', category_id: 'cat-3',
        name: 'Mixed Grill Platter', name_ar: 'مشاوي مشكلة',
        description: 'Assorted grilled meats: kebab, tikka, and shish tawook', description_ar: 'تشكيلة من اللحوم المشوية: كباب وتيكا وشيش طاووق',
        price: 32000, image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80',
        is_available: true, sort_order: 1, created_at: ''
    },
    {
        id: 'item-8', category_id: 'cat-3',
        name: 'Lamb Kebab', name_ar: 'كباب لحم',
        description: 'Juicy lamb kebab with onions and parsley', description_ar: 'كباب لحم طري مع البصل والبقدونس',
        price: 15000, image_url: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=600&q=80',
        is_available: true, sort_order: 2, created_at: ''
    },
    // Soups
    {
        id: 'item-9', category_id: 'cat-4',
        name: 'Lentil Soup', name_ar: 'شوربة عدس',
        description: 'Hearty red lentil soup with cumin and lemon', description_ar: 'شوربة عدس أحمر غنية مع الكمون والليمون',
        price: 4000, image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80',
        is_available: true, sort_order: 1, created_at: ''
    },
    {
        id: 'item-10', category_id: 'cat-4',
        name: 'Lamb Bone Broth', name_ar: 'مرق عظام اللحم',
        description: 'Rich traditional bone broth simmered for 12 hours', description_ar: 'مرق عظام تقليدي غني يُطهى لمدة 12 ساعة',
        price: 6000, image_url: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&q=80',
        is_available: true, sort_order: 2, created_at: ''
    },
    // Drinks
    {
        id: 'item-11', category_id: 'cat-5',
        name: 'Mint Lemonade', name_ar: 'ليموناضة بالنعناع',
        description: 'Freshly squeezed lemon with garden mint', description_ar: 'ليمون طازج مع نعناع الحديقة',
        price: 3500, image_url: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9e?w=600&q=80',
        is_available: true, sort_order: 1, created_at: ''
    },
    {
        id: 'item-12', category_id: 'cat-5',
        name: 'Jallab Juice', name_ar: 'عصير جلاب',
        description: 'Rose water, grape and tamarind refresher with pine nuts', description_ar: 'مشروب منعش بماء الورد والعنب والتمر الهندي مع الصنوبر',
        price: 4000, image_url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&q=80',
        is_available: true, sort_order: 2, created_at: ''
    },
    // Desserts
    {
        id: 'item-13', category_id: 'cat-6',
        name: 'Baklava', name_ar: 'بقلاوة',
        description: 'Crispy layers of phyllo, honey and mixed nuts', description_ar: 'طبقات مقرمشة من العجين مع العسل والمكسرات',
        price: 5000, image_url: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=600&q=80',
        is_available: true, sort_order: 1, created_at: ''
    },
    {
        id: 'item-14', category_id: 'cat-6',
        name: 'Kunafa', name_ar: 'كنافة',
        description: 'Classic kunafa with sweet cheese and rose water syrup', description_ar: 'كنافة كلاسيكية بالجبن الحلو وقطر ماء الورد',
        price: 6500, image_url: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=600&q=80',
        is_available: true, sort_order: 2, created_at: ''
    },
];

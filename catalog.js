// الأقسام والأغراض الجاهزة (حسب ملف الإكسل المعتمد، الإصدار 1.2).
// لإضافة غرض دائم: أضف سطراً بالشكل [المعرّف, الاسم, القسم, الرمز]
// المعرّف حروف إنجليزية صغيرة وأرقام فقط، ولا يتكرر، ولا يُغيَّر بعد اعتماده
// (اختيارات الطلبات والمشتريات محفوظة بالمعرّف).

export const CATS = [
  ['dairy', 'ألبان وحليب'],
  ['bakery', 'دقيق وخبز'],
  ['sweets', 'حلى وشكولاته'],
  ['meat', 'لحوم ودواجن'],
  ['veg', 'خضار وفواكه'],
  ['pantry', 'مؤن'],
  ['cans', 'معلبات'],
  ['drinks', 'مشروبات وسناكس'],
  ['clean', 'منظفات'],
  ['care', 'عناية شخصية'],
  ['other', 'أخرى']
];

// معرّفات قديمة لم تعد في القائمة (تُنظَّف اختياراتها وصورها عند الترحيل)
export const RETIRED = ['cheese', 'chocolate'];

export const CATALOG = [
  // ألبان وحليب
  ['milk', 'حليب طازج', 'dairy', '🥛'],
  ['milkpowder', 'حليب بودرة', 'dairy', '🍼'],
  ['evapmilk', 'حليب معلب', 'dairy', '🥫'],
  ['nestle', 'حليب نستله', 'dairy', '🐄'],
  ['qishta', 'قشطة طازجه', 'dairy', '🥄'],
  ['qishtacan', 'قشطة معلبة', 'dairy', '🥫'],
  ['laban', 'لبن', 'dairy', '🥛'],
  ['yogurt', 'زبادي', 'dairy', '🥣'],
  ['labneh', 'لبنه', 'dairy', '🫙'],
  ['kiri', 'جبنة كيري', 'dairy', '🧀'],
  ['triangles', 'جبنة مثلثات', 'dairy', '🧀'],
  ['slices', 'جبنة هامبرجر', 'dairy', '🍔'],
  ['kraft', 'جبنة كرافت', 'dairy', '🧀'],
  ['cheesecups', 'جبنة كاسات', 'dairy', '🧀'],
  ['feta', 'جبنة فيتا', 'dairy', '🧀'],
  ['mozzarella', 'جبنة موزريلا', 'dairy', '🍕'],
  ['cookcream', 'كريمة طبخ', 'dairy', '🍲'],
  ['whipcream', 'كريمة خفق', 'dairy', '🧁'],
  ['butter', 'زبدة', 'dairy', '🧈'],
  ['eggs', 'بيض', 'dairy', '🥚'],

  // دقيق وخبز
  ['bread', 'خبز', 'bakery', '🫓'],
  ['samoli', 'صامولي', 'bakery', '🥖'],
  ['rusk', 'شابورة', 'bakery', '🥯'],
  ['toastw', 'توست ابيض', 'bakery', '🍞'],
  ['toastb', 'توست بر', 'bakery', '🥪'],
  ['milletflour', 'دقيق دخن', 'bakery', '🌾'],
  ['flour', 'دقيق ابيض', 'bakery', '🌾'],
  ['wwflour', 'دقيق بر', 'bakery', '🌾'],
  ['yeast', 'خميرة فورية', 'bakery', '🥄'],
  ['cakeyeast', 'خميرة كيك', 'bakery', '🧂'],
  ['pasta', 'مكرونة', 'bakery', '🍝'],
  ['spaghetti', 'مكرونة طويله', 'bakery', '🍝'],
  ['vermicelli', 'شعيرية', 'bakery', '🍜'],
  ['pakvermicelli', 'شعيرية باكستانية', 'bakery', '🍜'],
  ['indomie', 'اندومي', 'bakery', '🍜'],

  // حلى وشكولاته
  ['dreamwhip', 'دريم ويب', 'sweets', '🍦'],
  ['cream', 'كريمة', 'sweets', '🍨'],
  ['jelly', 'جلي', 'sweets', '🍧'],
  ['nutella', 'نوتيلا', 'sweets', '🫙'],
  ['peanuts', 'فول سوداني', 'sweets', '🥜'],
  ['bakingpowder', 'باكنج باودر', 'sweets', '🧂'],
  ['vanilla', 'فانيليا', 'sweets', '🌼'],
  ['custard', 'كاسترد', 'sweets', '🍮'],
  ['starch', 'نشا', 'sweets', '🌽'],
  ['vanillacake', 'كيك فانيليا', 'sweets', '🍰'],
  ['chococake', 'كيك شوكولاته', 'sweets', '🎂'],
  ['familycake', 'كيك العائلة', 'sweets', '🧁'],
  ['cocoa', 'شوكولاته بودرة', 'sweets', '🍫'],

  // لحوم ودواجن
  ['chicken', 'دجاج', 'meat', '🍗'],
  ['breast', 'صدور دجاج', 'meat', '🐔'],
  ['minced', 'لحم مفروم', 'meat', '🍖'],
  ['meat', 'لحم', 'meat', '🥩'],
  ['fish', 'سمك', 'meat', '🐟'],
  ['shrimp', 'روبيان', 'meat', '🦐'],
  ['sausage', 'نقانق', 'meat', '🌭'],
  ['nuggets', 'نجت', 'meat', '🍤'],
  ['beefburger', 'همبرجر لحم', 'meat', '🍔'],
  ['chickenburger', 'همبرجر دجاج', 'meat', '🍔'],

  // خضار وفواكه
  ['tomato', 'طماطم', 'veg', '🍅'],
  ['cucumber', 'خيار', 'veg', '🥒'],
  ['onion', 'بصل', 'veg', '🧅'],
  ['garlic', 'ثوم', 'veg', '🧄'],
  ['greenonion', 'بصل اخضر', 'veg', '🌱'],
  ['potato', 'بطاطس', 'veg', '🥔'],
  ['carrot', 'جزر', 'veg', '🥕'],
  ['pepper', 'فلفل رومي', 'veg', '🫑'],
  ['lettuce', 'خس', 'veg', '🥬'],
  ['arugula', 'جرجير', 'veg', '🥗'],
  ['lemon', 'ليمون', 'veg', '🍋'],
  ['zucchini', 'كوسة', 'veg', '🥒'],
  ['parsley', 'بقدونس', 'veg', '🌿'],
  ['coriander', 'كزبره', 'veg', '🍃'],
  ['banana', 'موز', 'veg', '🍌'],
  ['apple', 'تفاح', 'veg', '🍎'],
  ['orange', 'برتقال', 'veg', '🍊'],
  ['grapes', 'عنب', 'veg', '🍇'],
  ['watermelon', 'بطيخ', 'veg', '🍉'],
  ['strawberry', 'فراولة', 'veg', '🍓'],
  ['eggplant', 'باذنجان', 'veg', '🍆'],
  ['molokhia', 'ملوخيه', 'veg', '🥬'],
  ['greenbeans', 'فاصولياء', 'veg', '🫘'],

  // مؤن
  ['rice', 'رز', 'pantry', '🍚'],
  ['dates', 'تمر', 'pantry', '🌴'],
  ['sugar', 'سكر', 'pantry', '🍬'],
  ['salt', 'ملح', 'pantry', '🧂'],
  ['oil', 'زيت', 'pantry', '🌻'],
  ['oliveoil', 'زيت زيتون', 'pantry', '🫒'],
  ['tea', 'شاي', 'pantry', '🍵'],
  ['coffee', 'قهوة', 'pantry', '☕'],
  ['cardamom', 'هيل', 'pantry', '🌱'],
  ['qassimmix', 'خلطة القصيم', 'pantry', '🥘'],
  ['spices', 'بهارات', 'pantry', '🌶️'],
  ['honey', 'عسل', 'pantry', '🍯'],
  ['lentils', 'عدس', 'pantry', '🫘'],
  ['oats', 'شوفان', 'pantry', '🥣'],
  ['cereal', 'كورن فليكس', 'pantry', '🌽'],
  ['ginger', 'زنجبيل', 'pantry', '🍠'],
  ['chamomile', 'بابونج', 'pantry', '🌼'],
  ['herbaltea', 'زهورات', 'pantry', '🌺'],

  // معلبات
  ['foul', 'فول معلب', 'cans', '🥫'],
  ['tuna', 'تونة', 'cans', '🐟'],
  ['tomatopaste', 'معجون طماطم', 'cans', '🥫'],
  ['ketchup', 'كاتشب', 'cans', '🍅'],
  ['corn', 'ذرة', 'cans', '🌽'],
  ['olives', 'زيتون', 'cans', '🫒'],
  ['kidneybeans', 'فاصولياء حمراء', 'cans', '🫘'],
  ['mushroom', 'مشروم', 'cans', '🍄'],
  ['chickpeas', 'حمص', 'cans', '🫘'],
  ['pineapple', 'اناناس', 'cans', '🍍'],
  ['sauces', 'صوصات', 'cans', '🍶'],
  ['tahini', 'طحينة سائلة', 'cans', '🫙'],
  ['halawa', 'حلاوه طحينية', 'cans', '🥮'],

  // مشروبات وسناكس
  ['water', 'مياه', 'drinks', '💧'],
  ['juice', 'عصير', 'drinks', '🧃'],
  ['juicepowder', 'عصير بودرة', 'drinks', '🍹'],
  ['soda', 'مشروبات غازية', 'drinks', '🥤'],
  ['teabiscuit', 'بسكويت شاهي', 'drinks', '🫖'],
  ['biscuit', 'بسكويت منوع', 'drinks', '🍪'],
  ['chips', 'شيبس', 'drinks', '🍟'],
  ['nuts', 'مكسرات', 'drinks', '🌰'],
  ['icecream', 'آيسكريم', 'drinks', '🍦'],

  // منظفات
  ['detergent', 'صابون غسيل', 'clean', '🧺'],
  ['soap', 'صابون يد', 'clean', '🧴'],
  ['lux', 'صابون لوكس', 'clean', '🧼'],
  ['softener', 'كمفورت', 'clean', '🫧'],
  ['dishsoap', 'سائل صحون', 'clean', '🧽'],
  ['bleach', 'كلوركس', 'clean', '🧪'],
  ['floor', 'منظف أرضيات', 'clean', '🪣'],
  ['freshener', 'معطر جو', 'clean', '🌸'],
  ['tissue', 'مناديل', 'clean', '🧻'],
  ['toiletpaper', 'ورق حمام', 'clean', '🧻'],
  ['trashbags', 'أكياس نفايات', 'clean', '🗑️'],
  ['sponge', 'إسفنج', 'clean', '🧽'],
  ['sufra', 'سفر', 'clean', '📜'],
  ['ovencleaner', 'منظف فرن', 'clean', '🔥'],
  ['steelwool', 'سلك مواعين', 'clean', '🧶'],
  ['papercups', 'كاسات ورق', 'clean', '🥤'],
  ['plates', 'صحون بلاستيك', 'clean', '🍽️'],
  ['spoons', 'ملاعق بلاستيك', 'clean', '🥄'],
  ['forks', 'شوكة بلاستيك', 'clean', '🍴'],
  ['foil', 'قصدير', 'clean', '🌯'],
  ['wrap', 'ورق تغليف', 'clean', '📦'],

  // عناية شخصية
  ['shampoo', 'شامبو', 'care', '🧴'],
  ['toothpaste', 'معجون أسنان', 'care', '🦷'],
  ['toothbrush', 'فرشاة أسنان', 'care', '🪥'],
  ['deodorant', 'مزيل عرق', 'care', '💨'],
  ['diapers', 'حفائض', 'care', '👶'],
  ['wetwipes', 'مناديل مبللة', 'care', '🧻'],
  ['pads', 'فوط صحية', 'care', '🩹'],
  ['shavefoam', 'موس حلاقه', 'care', '🪒']
];

// صور الأغراض: ملف واحد items.webp فيه 150 صورة، كل صورة 192×192، في شبكة 15 عموداً × 10 صفوف.
// ترتيب المعرّفات هنا هو ترتيب الصور في الملف (من اليسار لليمين ثم سطراً سطراً).
// الغرض الذي ليس له صورة هنا يظهر برمزه (الإيموجي).
export const SPRITE = {
  file: 'items.webp', cols: 15, rows: 10,
  ids: [
    'milk', 'milkpowder', 'evapmilk', 'nestle', 'qishta', 'qishtacan', 'laban', 'yogurt', 'labneh', 'kiri',
    'triangles', 'slices', 'kraft', 'cheesecups', 'feta', 'mozzarella', 'cookcream', 'whipcream', 'butter', 'eggs',
    'bread', 'samoli', 'rusk', 'toastw', 'toastb', 'milletflour', 'flour', 'wwflour', 'yeast', 'cakeyeast',
    'pasta', 'spaghetti', 'vermicelli', 'pakvermicelli', 'indomie', 'dreamwhip', 'cream', 'jelly', 'nutella', 'peanuts',
    'bakingpowder', 'vanilla', 'custard', 'starch', 'vanillacake', 'chococake', 'familycake', 'cocoa', 'chicken', 'breast',
    'minced', 'meat', 'fish', 'shrimp', 'sausage', 'nuggets', 'beefburger', 'chickenburger', 'tomato', 'cucumber',
    'onion', 'garlic', 'greenonion', 'potato', 'carrot', 'pepper', 'lettuce', 'arugula', 'lemon', 'zucchini',
    'parsley', 'coriander', 'banana', 'apple', 'orange', 'grapes', 'watermelon', 'strawberry', 'eggplant', 'molokhia',
    'greenbeans', 'rice', 'dates', 'sugar', 'salt', 'oil', 'oliveoil', 'tea', 'coffee', 'cardamom',
    'qassimmix', 'spices', 'honey', 'lentils', 'oats', 'cereal', 'ginger', 'chamomile', 'herbaltea', 'foul',
    'tuna', 'tomatopaste', 'ketchup', 'corn', 'olives', 'kidneybeans', 'mushroom', 'chickpeas', 'pineapple', 'sauces',
    'tahini', 'halawa', 'water', 'juice', 'juicepowder', 'soda', 'teabiscuit', 'biscuit', 'chips', 'nuts',
    'icecream', 'detergent', 'soap', 'lux', 'softener', 'dishsoap', 'bleach', 'floor', 'freshener', 'tissue',
    'toiletpaper', 'trashbags', 'sponge', 'sufra', 'ovencleaner', 'steelwool', 'papercups', 'plates', 'spoons', 'forks',
    'foil', 'wrap', 'shampoo', 'toothpaste', 'toothbrush', 'deodorant', 'diapers', 'wetwipes', 'pads', 'shavefoam'
  ]
};

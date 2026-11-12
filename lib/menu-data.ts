// 心園餐廳的店家與菜色資料（2026 年 11 月整理）。
// 價格看 Google 地圖上使用者拍的價目牌，每一區都寫了是哪個月拍的（PRICE_BOARD 的 date）。
// 照片也是 Google 地圖上使用者拍的心園實景，拍攝者寫在 photo-credits.json，頁面上每張圖下面都會標。

export type Category = 'drink' | 'meal' | 'snack';

export interface Dish {
  id: string;      // 推薦數用這個當 key，改了票數會歸零，不要改
  name: string;
  price: string;   // 顯示用
  cost?: number;   // 計算機用（一份的價格）。現場計價的菜不寫，計算機就不會用它
  unit: string;    // 一份是多少
  category: Category;
  shop: string;
  note: string;
  photo: string;   // public/img 裡的檔名（不含尺寸和副檔名）
}

export const CATEGORIES: { id: Category | 'all'; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'meal', label: '主食' },
  { id: 'drink', label: '飲料' },
  { id: 'snack', label: '點心' },
];

export const DISHES: Dish[] = [
  { id: 'juice', name: '檸檬汁', price: '$10', cost: 10, unit: '一杯', category: 'drink', shop: '果汁吧', photo: 'juice',
    note: '西瓜汁、冬瓜茶、紅茶也都 10 元。2023 年報導說 10 元果汁 32 年沒漲過，2026 年 9 月的牌子上還是 10 元。' },
  { id: 'dry-noodles', name: '乾麵', price: '$35', cost: 35, unit: '一碗', category: 'meal', shop: '麵食部', photo: 'dry-noodles',
    note: '麵食部最便宜的一碗。陽春麵、客家粄條、意麵也是 35 元。' },
  { id: 'dumplings', name: '水餃', price: '5 顆 $25', cost: 25, unit: '5 顆', category: 'meal', shop: '麵食部', photo: 'dumplings',
    note: '一顆 5 元，以 5 顆為單位加點。外帶要先跟老闆說。' },
  { id: 'curry', name: '咖哩雞肉燴飯', price: '$50', cost: 50, unit: '一份', category: 'meal', shop: '麵食部', photo: 'curry',
    note: '燴飯有三種：咖哩雞肉 50、蠔油豬肉 60、紅燒牛肉 70。' },
  { id: 'noodle-soup', name: '湯麵', price: '$35 起', cost: 35, unit: '一碗', category: 'meal', shop: '麵食部', photo: 'noodle-soup',
    note: '陽春麵、肉燥拉麵 35，肉羹麵 45，餛飩麵 50，當歸鴨麵線 55。' },
  { id: 'guava-lemon', name: '芭樂汁', price: '$20', cost: 20, unit: '一杯', category: 'drink', shop: '果汁吧', photo: 'juice-bar',
    note: '果汁吧最右邊那幾支牌子：柳丁汁 15、芭樂汁 20、香蕉牛奶 25。' },
  { id: 'waffle', name: '鬆餅', price: '$55 起', cost: 55, unit: '一份', category: 'snack', shop: '巧瑋鬆餅屋', photo: 'waffle',
    note: '蜂蜜、焦糖、花生 55 元；鹹的玉米蔬菜 65、培根或燻雞 75。週日公休。' },
  { id: 'buffet', name: '自助餐', price: '現場計價', unit: '一份', category: 'meal', shop: '自助餐', photo: 'buffet',
    note: '自己夾菜配白飯，依夾的菜現場算錢。' },
  { id: 'lumei', name: '滷味', price: '現場計價', unit: '一盤', category: 'meal', shop: '滷味', photo: 'lumei',
    note: '自己夾料再交給老闆滷，依夾的東西算錢。' },
  { id: 'fruit', name: '蘋果', price: '一顆 $15／$20', cost: 15, unit: '一顆', category: 'snack', shop: '水果攤', photo: 'fruit',
    note: '整顆賣，分兩種大小。' },
];

// 首頁的三張價目牌（照果汁吧掛在牆上的直式牌子做的）
export const HERO_TAGS = [
  { name: '檸檬汁', price: 10, ink: 'blue' },
  { name: '乾麵', price: 35, ink: 'green' },
  { name: '水餃五顆', price: 25, ink: 'red' },
] as const;

export interface BoardShop {
  shop: string;
  date: string;   // 價目牌照片拍攝的月份
  photo?: string;
  groups: { title?: string; items: [string, string][] }[];
  note?: string;
}

// 完整價目：照價目牌照片抄的
export const PRICE_BOARD: BoardShop[] = [
  {
    shop: '麵食部',
    date: '2025 年 9 月',
    note: '豬肉產地台灣、牛肉產地澳洲（店內公告）',
    groups: [
      { title: '麵', items: [
        ['乾麵', '35'], ['陽春麵', '35'], ['客家粄條', '35'], ['肉燥拉麵', '35'], ['意麵', '35'],
        ['榨菜肉絲乾麵', '40'], ['肉羹麵', '45'], ['餛飩麵', '50'], ['當歸鴨麵線', '55'], ['酸菜鴨麵', '55'],
      ] },
      { title: '飯', items: [
        ['滷肉飯', '小 30／大 40'], ['咖哩雞肉燴飯', '50'], ['蠔油豬肉燴飯', '60'], ['紅燒牛肉燴飯', '70'],
      ] },
      { title: '湯・小菜', items: [
        ['貢丸湯', '25'], ['魚丸湯', '25'], ['粉腸湯', '25'], ['燙青菜', '25'], ['青菜湯', '30'],
        ['餛飩湯', '35'], ['肝連湯', '35'], ['肉羹湯', '35'], ['當歸鴨湯', '45'], ['水餃 5 顆', '25'],
      ] },
    ],
  },
  {
    shop: '果汁吧',
    date: '2026 年 9 月',
    photo: 'juice-bar',
    note: '內用裝玻璃杯，喝完要還；自備杯子不加價（牌子上寫的）',
    groups: [
      { items: [
        ['檸檬汁', '10'], ['西瓜汁', '10'], ['冬瓜茶', '10'], ['紅茶', '10'],
        ['柳丁汁', '15'], ['芭樂汁', '20'], ['香蕉牛奶', '25'],
      ] },
    ],
  },
  {
    shop: '巧瑋鬆餅屋',
    date: '2026 年 9 月',
    photo: 'waffle-shop',
    groups: [
      { title: '甜鬆餅', items: [
        ['蜂蜜／焦糖／花生／奶油', '55'], ['抹茶／椰香／芝麻／草莓／藍莓', '60'], ['巧克力／鮮奶油', '65'],
        ['桑椹／香橙檸檬／卡士達', '70'], ['綜合口味', '60–85'], ['可可系列', '60–100'],
      ] },
      { title: '鹹鬆餅', items: [
        ['玉米蔬菜', '65'], ['鮪魚／培根／燻雞／照燒豬', '75'], ['德州烤雞腿', '85'],
        ['椒麻雞腿／花生培根', '90'], ['厚切沙朗牛肉', '95'],
      ] },
      { title: '茶飲', items: [
        ['冬瓜茶', '20'], ['紅茶／無糖綠茶', '25'], ['伯爵奶茶／茉香奶綠', '30'], ['冬瓜鮮奶', '45'],
      ] },
    ],
  },
  {
    shop: '水果攤',
    date: '2024 年 10 月',
    groups: [{ items: [['蘋果（一顆）', '15／20']] }],
  },
];

export const HOURS = [
  { who: '心園餐廳', when: ['週一～五 08:00–21:00', '週六、日 11:00–19:30'], src: 'Google 地圖店家資訊' },
  { who: '麵食部', when: ['11:00 開始賣'], src: 'Google 地圖評論（2026 年初）' },
  { who: '巧瑋鬆餅屋', when: ['平日 08:30–19:00', '週六 10:30–18:00', '週日、國定假日公休'], src: '店門口公告（2026 年 9 月）' },
];

export const INFO = {
  location: '信義和平學苑（宿舍）地下一樓',
  address: '新北市新莊區中正路 510 號（輔仁大學校內）',
  phone: '02-2905-6295',
  others: '同一層還有影印店、手機維修。寒暑假和考試週的時間可能不一樣，出發前先看 Google 地圖。',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=%E8%BC%94%E4%BB%81%E5%A4%A7%E5%AD%B8+%E5%BF%83%E5%9C%92%E9%A4%90%E5%BB%B3',
};

export const UPDATED = '2026 年 11 月';

export const SOURCES = [
  { title: 'Google 地圖「心園餐廳」：使用者拍的價目牌、照片與評論（2024 年 10 月～2026 年 10 月）', url: INFO.mapUrl },
  { title: 'ETtoday 旅遊雲：輔大學餐 10 元果汁凍漲 32 年（2023-05-14）', url: 'https://travel.ettoday.net/article/2497088.htm' },
  { title: '自由時報 玩咖 Playing：輔大學餐現榨 500cc 果汁只賣十元（2023-05-16）', url: 'https://playing.ltn.com.tw/article/27690/1' },
];

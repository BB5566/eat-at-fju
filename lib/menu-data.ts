// 心園餐廳的店家與菜色資料。
// 價格來自 2023 年 5 月的新聞報導（見 SOURCES），交作業前要到現場再確認一次。
// 照片是維基共享資源的示意照（授權見 photo-credits.json），不是心園實拍；有實拍照就換掉 public/img 裡同名檔案。

export interface Dish {
  id: string;
  name: string;
  price: string;
  shop: string;
  note: string;
  photo: string;
}

export const DISHES: Dish[] = [
  { id: 'juice', name: '現榨果汁 500cc', price: '$10', shop: '水果部', photo: '/img/juice.jpg',
    note: '檸檬、柳丁、西瓜等當季口味，32 年沒漲價，用懷舊玻璃杯裝。' },
  { id: 'guava-lemon', name: '芭樂檸檬汁', price: '$15', shop: '水果部', photo: '/img/guava-lemon.jpg',
    note: '隱藏版口味，菜單上不一定看得到，要開口問。' },
  { id: 'fruit', name: '切塊水果', price: '$20', shop: '水果部', photo: '/img/fruit.jpg',
    note: '已經切好裝盒，下課直接帶走。' },
  { id: 'dumplings', name: '現煮水餃', price: '5 顆 $20', shop: '麵食部', photo: '/img/dumplings.jpg',
    note: '一顆 4 元，想吃多少點多少。' },
  { id: 'curry', name: '咖哩雞肉燴飯', price: '$45', shop: '麵食部', photo: '/img/curry.jpg',
    note: '銅板價就能吃飽的一餐。' },
  { id: 'lumei', name: '滷味', price: '一盤 < $50', shop: '滷味', photo: '/img/lumei.jpg',
    note: '自己夾，份量大、價格友善。' },
  { id: 'waffle', name: '鬆餅', price: '約 $30', shop: '巧瑋鬆餅屋', photo: '/img/waffle.jpg',
    note: '被稱為「輔大三寶」之一。價格是 3 年以上的食記資料，可能已調整。' },
];

// 首頁的三個亮點數字
export const HIGHLIGHTS = [
  { big: '$10', label: '一大杯 500cc 現榨果汁' },
  { big: '32 年', label: '果汁價格從來沒漲過' },
  { big: '$4', label: '一顆現煮水餃' },
];

export const INFO = {
  location: '和平、信義學苑（男生宿舍）地下一樓',
  address: '新北市新莊區中正路 510 號（輔仁大學校內）',
  hours: '大約 08:00～21:00，週末營業時間較短或休息（各家不同，以現場公告為準）',
  others: '同一層還有影印店、手機維修。',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=%E8%BC%94%E4%BB%81%E5%A4%A7%E5%AD%B8+%E5%BF%83%E5%9C%92%E9%A4%90%E5%BB%B3',
};

export const SOURCES = [
  { title: 'ETtoday 旅遊雲：輔大學餐 10 元果汁凍漲 32 年（2023-05-14）', url: 'https://travel.ettoday.net/article/2497088.htm' },
  { title: '自由時報 玩咖 Playing：輔大學餐現榨 500cc 果汁只賣十元（2023-05-16）', url: 'https://playing.ltn.com.tw/article/27690/1' },
  { title: '愛評網：心園巧瑋鬆餅屋', url: 'https://www.fonfood.com/store/257378' },
];

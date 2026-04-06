export interface User {
  id: string;
  name: string;
  phone: string;
  score: number;
}

export interface Checkpoint {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  location: { lat: number; lng: number };
  points: number;
  scanned: boolean;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  checkpoints: Checkpoint[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  quantity: number;
  image: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
}

// Mock Data with Traditional Chinese
export const mockEvents: Event[] = [
  {
    id: '1',
    name: '長洲島歷史文化探索',
    description: '探索長洲島的歷史古蹟與自然美景，發現隱藏的寶藏！',
    isActive: true,
    checkpoints: [
      {
        id: 'cp1',
        name: '北帝廟',
        nameEn: 'Pak Tai Temple',
        description: '建於1783年的歷史古廟，香火鼎盛',
        location: { lat: 22.2086, lng: 114.0299 },
        points: 10,
        scanned: false
      },
      {
        id: 'cp2',
        name: '太平清醮場地',
        nameEn: 'Bun Festival Venue',
        description: '著名飘色會場，每年重點活動',
        location: { lat: 22.2100, lng: 114.0310 },
        points: 15,
        scanned: false
      },
      {
        id: 'cp3',
        name: '長洲長城',
        nameEn: 'Mini Great Wall',
        description: '漂亮的海岸步道，欣賞海景',
        location: { lat: 22.2050, lng: 114.0280 },
        points: 20,
        scanned: false
      },
      {
        id: 'cp4',
        name: '東灣泳灘',
        nameEn: 'Tung Wan Beach',
        description: '美麗沙灘，適合游泳曬太陽',
        location: { lat: 22.2070, lng: 114.0260 },
        points: 10,
        scanned: false
      }
    ]
  },
  {
    id: '2',
    name: '旺角街市文化試探',
    description: '試探活動 - 體驗旺角市集文化',
    isActive: true,
    checkpoints: [
      {
        id: 'cp5',
        name: '朗豪坊',
        nameEn: 'Langham Place',
        description: '購物地標，現代化商場',
        location: { lat: 22.3193, lng: 114.1694 },
        points: 5,
        scanned: false
      },
      {
        id: 'cp6',
        name: '旺角電腦中心',
        nameEn: 'Mongkok Computer Centre',
        description: '電腦產品集中地',
        location: { lat: 22.3167, lng: 114.1700 },
        points: 10,
        scanned: false
      }
    ]
  }
];

export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: '長洲紀念T恤',
    description: '活動限定紀念T恤，設計精美',
    pointsRequired: 50,
    quantity: 100,
    image: '👕'
  },
  {
    id: 'p2',
    name: '長洲特色小食禮盒',
    description: '包含長洲特色小食（魚蛋、大魚蛋等）',
    pointsRequired: 30,
    quantity: 200,
    image: '🍪'
  },
  {
    id: 'p3',
    name: '飄色紀念匙扣',
    description: '手工製作飄色人物匙扣',
    pointsRequired: 20,
    quantity: 150,
    image: '🔑'
  },
  {
    id: 'p4',
    name: '環保購物袋',
    description: '長洲地圖設計購物袋',
    pointsRequired: 40,
    quantity: 80,
    image: '🛍️'
  }
];

export const mockNotices: Notice[] = [
  {
    id: 'n1',
    title: '歡迎參加長洲探索活動！',
    content: '在各個簽碼位置掃描QR碼即可獲得積分，積分可換取精美紀念品！',
    timestamp: new Date()
  },
  {
    id: 'n2',
    title: '紀念品換領',
    content: '請前往活動主會場入口處的紀念品換領櫃位，出示您的積分即可換領。',
    timestamp: new Date()
  }
];

export const mockUsers: User[] = [
  { id: 'u1', name: '陳小明', phone: '+85212345678', score: 25 },
  { id: 'u2', name: '林大偉', phone: '+85287654321', score: 45 },
  { id: 'u3', name: '黃美玲', phone: '+85211223344', score: 60 }
];

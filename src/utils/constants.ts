import { DuckAccessory, Student } from '../types';

export const DUCK_COLORS = [
  { label: 'Vàng Cổ Điển', hex: '#FACC15', beak: '#EA580C', outline: '#CA8A04' },
  { label: 'Cam Tươi Vui', hex: '#FB923C', beak: '#C2410C', outline: '#EA580C' },
  { label: 'Hồng Đáng Yêu', hex: '#F472B6', beak: '#E11D48', outline: '#DB2777' },
  { label: 'Xanh Ngọc Lam', hex: '#2DD4BF', beak: '#D97706', outline: '#0D9488' },
  { label: 'Xanh Dương Bầu Trời', hex: '#38BDF8', beak: '#D97706', outline: '#0284C7' },
  { label: 'Xanh Lá Tinh Nghịch', hex: '#4ADE80', beak: '#EA580C', outline: '#16A34A' },
  { label: 'Tím Quý Phái', hex: '#C084FC', beak: '#D97706', outline: '#9333EA' },
  { label: 'Đỏ Năng Động', hex: '#F87171', beak: '#B45309', outline: '#DC2626' },
  { label: 'Xanh Chanh Neon', hex: '#A3E635', beak: '#D97706', outline: '#65A30D' },
  { label: 'Vàng Kim Hoàng Gia', hex: '#FDE047', beak: '#C2410C', outline: '#EAB308' },
];

export const ACCESSORIES: { id: DuckAccessory; label: string; icon: string }[] = [
  { id: 'none', label: 'Không nón', icon: '🐣' },
  { id: 'grad_cap', label: 'Mũ Cử Nhân', icon: '🎓' },
  { id: 'crown', label: 'Vương Miện', icon: '👑' },
  { id: 'sunglasses', label: 'Kính Râm Cool', icon: '😎' },
  { id: 'chef', label: 'Mũ Đầu Bếp', icon: '👨‍🍳' },
  { id: 'pirate', label: 'Hải Tặc', icon: '🏴‍☠️' },
  { id: 'propeller', label: 'Nón Chong Chóng', icon: '🚁' },
  { id: 'flower', label: 'Bông Hoa Hồng', icon: '🌸' },
  { id: 'headband', label: 'Băng Đô Thể Thao', icon: '⚡' },
];

export const DURATION_PRESETS = [5, 10, 15, 20, 30, 45, 60];

export const SAMPLE_CLASSES: { name: string; students: string[] }[] = [
  {
    name: 'Lớp 6A (Toán Thầy Hoàng)',
    students: [
      'Nguyễn Minh Anh', 'Trần Bảo An', 'Lê Gia Hưng', 'Phạm Quỳnh Chi', 
      'Vũ Tuấn Kiệt', 'Đỗ Thảo Linh', 'Hoàng Gia Bảo', 'Ngô Khánh Vy',
      'Đặng Nhật Nam', 'Bùi Ngọc Mai', 'Lý Quang Vinh', 'Dương Phương Thảo',
      'Mai Hoàng Long', 'Hà Tuyết Nhi', 'Trịnh Hữu Phước'
    ]
  },
  {
    name: 'Lớp 10 Chuyên Anh',
    students: [
      'Alexander Tuấn', 'Emily Trúc Linh', 'Michael Đức', 'Sophia Hà My',
      'Daniel Minh', 'Chloe Bảo Ngọc', 'Lucas Khang', 'Jessica Phương',
      'David Hoàng', 'Mia Thảo', 'Ethan Phúc', 'Olivia Vân'
    ]
  },
  {
    name: 'CLB Kỹ Năng & STEM',
    students: [
      'Nguyễn Trọng Tấn', 'Lê Thị Thu Hà', 'Trần Đình Trọng', 'Vũ Thị Thanh Hằng',
      'Phan Thành Đạt', 'Nguyễn Thị Ngọc Ánh', 'Lương Thế Vinh', 'Đoàn Văn Hậu'
    ]
  },
  {
    name: 'Tổ 1 - Thi Đua Tuần',
    students: [
      'Nguyễn Quốc Bảo', 'Trần Thị Mỹ Duyên', 'Lê Văn Hùng', 'Phạm Thanh Mai',
      'Huỳnh Tấn Phát', 'Võ Thị Hồng Nhung'
    ]
  }
];

export function getRandomDuckProps(): { color: string; accessory: DuckAccessory } {
  const randomColor = DUCK_COLORS[Math.floor(Math.random() * DUCK_COLORS.length)].hex;
  const accessoriesWithoutNone: DuckAccessory[] = ['grad_cap', 'crown', 'sunglasses', 'chef', 'pirate', 'propeller', 'flower', 'headband'];
  // 65% chance of wearing an accessory
  const accessory = Math.random() < 0.65 
    ? accessoriesWithoutNone[Math.floor(Math.random() * accessoriesWithoutNone.length)]
    : 'none';
  return { color: randomColor, accessory };
}

export function createStudent(name: string): Student {
  const { color, accessory } = getRandomDuckProps();
  return {
    id: 's_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36),
    name: name.trim(),
    color,
    accessory,
    isEliminated: false,
    winsCount: 0,
    addedAt: Date.now()
  };
}

export const INITIAL_STUDENTS: Student[] = SAMPLE_CLASSES[0].students.map(createStudent);

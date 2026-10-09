export type DuckAccessory = 
  | 'none'
  | 'crown'
  | 'grad_cap'
  | 'sunglasses'
  | 'chef'
  | 'pirate'
  | 'propeller'
  | 'flower'
  | 'headband';

export interface Student {
  id: string;
  name: string;
  color: string;
  accessory: DuckAccessory;
  isEliminated: boolean;
  winsCount: number;
  addedAt: number;
}

export interface DuckRacer {
  id: string;
  studentId: string;
  name: string;
  color: string;
  accessory: DuckAccessory;
  xProgress: number; // 0 to 100
  laneY: number;     // vertical lane offset
  currentSpeed: number;
  burstTimer: number; // time left for temporary speed boost
  slowTimer: number;  // time left for sudden slowdown/water vortex
  quackTimer: number;
  bobbingOffset: number;
  hasFinished: boolean;
  finishRank?: number;
  finishTime?: number;
}

export type RaceStatus = 'idle' | 'countdown' | 'racing' | 'paused' | 'finished';

export interface RaceSettings {
  durationSeconds: number;
  autoEliminateWinner: boolean;
  soundEnabled: boolean;
  theme: 'river' | 'sunny_bay' | 'twilight';
  showLeaderboard: boolean;
}

export interface WinnerRecord {
  id: string;
  studentId: string;
  studentName: string;
  color: string;
  accessory: DuckAccessory;
  timestamp: number;
  eliminated: boolean;
}

export interface Task {
  id: number;
  title: string;
  taskType: string;
  priority: string;
  startTime: string;
  frequency: string;
  context: string;
  userId: number;
  folderId?: number;
}

// 表示用に Task を拡張して、completed などのプロパティを追加する
export interface DisplayTask extends Task {
  completed: boolean;
  createdAt: string;
  
}
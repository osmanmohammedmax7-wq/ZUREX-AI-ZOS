export type TabKey = 'chat' | 'voice' | 'search' | 'tasks' | 'settings';

export type TaskStatus = 'Planning' | 'Working' | 'Testing' | 'Waiting' | 'Completed' | 'Error';

export type ChatMessage = {
  id: number;
  role: 'user' | 'assistant';
  text: string;
};

export type TaskItem = {
  id: number;
  name: string;
  status: TaskStatus;
  progress: number;
  kind: 'Working' | 'Waiting' | 'Completed' | 'Error';
  tools: string[];
  files: { name: string; state: 'Created' | 'Updated'; }[];
  activity: { time: string; text: string }[];
  decision: string;
  error?: string;
  result: string;
};

export type SearchResult = {
  title: string;
  source: string;
  snippet: string;
  url: string;
};

export interface HackerNewsEntry {
  number: number;
  title: string;
  points: number;
  comments: number;
}

export interface UsageData {
  timestamp: string;
  filter_applied: string;
  execution_time: number;
}

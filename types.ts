
export interface GuideContent {
  name: string;
  card: string;
  origin: string[];
  gossip: string[];
  media: string;
  interaction: string[];
}

export interface AppState {
  isLoading: boolean;
  guide: GuideContent | null;
  error: string | null;
  imageUrl: string | null;
}

export interface ProfileListConfig {
  type: string;
  filters: {
    username?: string;
    query?: string;
    limit?: number;
    offset?: number;
  };
}

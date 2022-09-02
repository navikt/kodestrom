export interface Repository {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
}

export interface PushEvent {
  ref: string;
  before: string;
  after: string;
  commits: string[];
  repository: Repository;
}

export const eventHeaderName = "x-github-event";
export const signatureHeaderName = "x-hub-signature-256";

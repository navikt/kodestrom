export interface Repository {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
}

export interface User {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  html_url: string;
}

export interface PushEvent {
  ref: string;
  before: string;
  after: string;
  commits: string[];
  repository: Repository;
  sender: User;
}

export const eventHeaderName = "x-github-event";
export const signatureHeaderName = "x-hub-signature-256";

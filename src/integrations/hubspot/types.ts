
export interface ContactResult {
  id: string;
  properties: {
    firstname?: string;
    lastname?: string;
    email?: string;
    company?: string;
    jobtitle?: string;
    phone?: string;
    [key: string]: string | undefined;
  };
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

export interface ContactRecord {
  id: string;
  properties: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

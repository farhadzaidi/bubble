export type Record = {
  id: number;
  username: string;
  public_key: string;
  entry_hash: string;
  prev_hash: string | null;
  created_at: Date;
};

export type PartialRecord = {
  id: number;
  username: string;
  public_key: string;
  prev_hash: string | null;
};

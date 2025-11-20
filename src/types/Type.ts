export interface IUser {
  id: number | string;
  username: string;
  full_name?: string;
  email?: string;
  photo_profile?: string | null;
}

export interface UserAuth {
  email: string;
  token: string;
  expiresIn: number;
  userId: string;
  status: number;
  message: string;
}

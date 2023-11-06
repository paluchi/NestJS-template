export interface UserData {
  username: string;
  password: string;
}

export type UserType = "platform_user" | "platform_intern";

export interface User {
  id: string;
  username: string;
  type: UserType;
}

export interface UserContextType {
  user: User | null;
  isLogged: boolean;
  loading: boolean;
  error: Error | null;
  token: string | null;
  register: (username: string, password: string) => Promise<void>;
  login: (username: string, password: string, as?: UserType) => Promise<User>;
  logout: () => Promise<void>;
  checkExpiration: (jwt?: string) => { expired: boolean; decodedJwt: any };
}

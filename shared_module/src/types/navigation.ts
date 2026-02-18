import type {LoginResponse} from './auth';

export interface NavigationActions {
  onLoginSuccess: (response: LoginResponse) => void;
  onLoginError?: (error: string) => void;
}

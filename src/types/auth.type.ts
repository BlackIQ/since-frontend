export interface Signup {
  email: string;
  password: string;
  username: string;
  display_name: string;
  first_name?: string | null;
  last_name?: string | null;
}

export interface Signin {
  username: string;
  password: string;
}

export interface ResendConfirmation {
  email: string;
}

export interface Forgot {
  email: string;
}

export interface ResetPassword {
  new_password: string;
  confirm_password: string;
}

export interface ResetPasswordPayload {
  token: string;
  new_password: string;
  confirm_password: string;
}

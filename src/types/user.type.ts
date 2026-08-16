export interface UserProfile {
  id: string;
  username: string;
  email: string;
  display_name: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfilePayload {
  username?: string;
  display_name?: string;
  first_name?: string | null;
  last_name?: string | null;
}

export interface UpdateEmailPayload {
  email: string;
}

export interface UpdatePasswordPayload {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

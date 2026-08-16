import { API } from "@/api";
import URLs from "@/api/urls";
import {
  UserProfile,
  UpdateProfilePayload,
  UpdateEmailPayload,
  UpdatePasswordPayload,
} from "@/types/user.type";

const { user } = URLs;

export const me = async (): Promise<UserProfile> => {
  const response = await API.get<UserProfile>(`${user}/me`);
  return response.data;
};

export const updateProfile = async (
  payload: UpdateProfilePayload,
): Promise<UserProfile> => {
  const response = await API.patch<UserProfile>(`${user}/me`, payload);
  return response.data;
};

export const updatePassword = async (
  payload: UpdatePasswordPayload,
): Promise<UserProfile> => {
  const response = await API.patch<UserProfile>(`${user}/password`, payload);
  return response.data;
};

export const updateEmail = async (
  payload: UpdateEmailPayload,
): Promise<UserProfile> => {
  const response = await API.patch<UserProfile>(`${user}/email`, payload);
  return response.data;
};

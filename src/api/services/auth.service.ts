import { API } from "@/api";
import URLs from "@/api/urls";
import {
  Signin,
  Signup,
  Forgot,
  ResendConfirmation,
  ResetPasswordPayload,
} from "@/types/auth.type";
import { Token, MessageResponse } from "@/types/common.type";

const { auth } = URLs;

export const signinAuthentication = async (data: Signin): Promise<Token> => {
  const response = await API.post<Token>(`${auth}/signin`, data);
  return response.data;
};

export const signupAuthentication = async (
  data: Signup,
): Promise<MessageResponse> => {
  const response = await API.post<MessageResponse>(`${auth}/signup`, data);
  return response.data;
};

export const confirmEmail = async (token: string): Promise<MessageResponse> => {
  const response = await API.get<MessageResponse>(
    `${auth}/confirm-email?token=${token}`,
  );
  return response.data;
};

export const resendConfirmationEmail = async (
  data: ResendConfirmation,
): Promise<MessageResponse> => {
  const response = await API.post<MessageResponse>(
    `${auth}/resend-confirmation`,
    data,
  );
  return response.data;
};

export const forgotPassword = async (
  data: Forgot,
): Promise<MessageResponse> => {
  const response = await API.post<MessageResponse>(
    `${auth}/forgot-password`,
    data,
  );
  return response.data;
};

export const resetPassword = async (
  data: ResetPasswordPayload,
): Promise<MessageResponse> => {
  const response = await API.post<MessageResponse>(
    `${auth}/reset-password`,
    data,
  );
  return response.data;
};

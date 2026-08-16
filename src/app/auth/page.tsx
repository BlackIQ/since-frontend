"use client";

// React
import { useState, useEffect, Suspense, useRef } from "react";

// Redux
import { useDispatch } from "react-redux";

// Next
import { useRouter, useSearchParams } from "next/navigation";

// Axios
import { isAxiosError } from "axios";

// Redux things
import { setToken } from "@/redux/slices/token.slice";

// Components
import Form from "@/components/form.component"; // Form
import useAuth from "@/hooks/auth.hook";
import {
  signinAuthentication,
  signupAuthentication,
  forgotPassword,
  resetPassword,
  confirmEmail,
  resendConfirmationEmail,
} from "@/api/services/auth.service";
import { Signin, Signup, Forgot, ResetPassword } from "@/types/auth.type";
import { getErrorMessage, showToast } from "@/utils/toast.util";
import {
  Box,
  Typography,
  Button,
  Grid,
  Link as MUILink,
  Divider,
  Alert,
  AlertTitle,
  CircularProgress,
  Stack,
} from "@mui/material";

type modeType = "login" | "register" | "forgot" | "reset";

interface AlertState {
  type: "success" | "warning" | "error" | "info";
  title: string;
  message: string;
  showResend?: boolean;
}

const AuthContent = () => {
  useAuth(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [mode, setMode] = useState<modeType>("login");
  const [alert, setAlert] = useState<AlertState | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [resetToken, setResetToken] = useState<string | null>(null);
  const hasProcessedAuthParamsRef = useRef(false);

  const changeMode = (newMode: modeType) => {
    setAlert(null);
    setMode(newMode);
  };

  const handleConfirmEmail = async (token: string) => {
    setLoading(true);
    try {
      const res = await confirmEmail(token);
      setAlert({
        type: "success",
        title: "Account Confirmed",
        message:
          res.message || "Your email has been confirmed. You can now sign in.",
      });
      showToast.success(
        res.message || "Your email has been confirmed. You can now sign in.",
      );
      setMode("login");
      router.replace("/auth");
    } catch (error) {
      setAlert({
        type: "error",
        title: "Confirmation Failed",
        message:
          "Invalid or expired token. Please request a new confirmation link.",
      });
      showToast.error(getErrorMessage(error, "Confirmation failed."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasProcessedAuthParamsRef.current) {
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const confirmTok = params.get("token") ?? searchParams.get("token");
    const resetTok =
      params.get("reset_token") ?? searchParams.get("reset_token");
    if (confirmTok) {
      hasProcessedAuthParamsRef.current = true;
      void handleConfirmEmail(confirmTok);
    } else if (resetTok) {
      hasProcessedAuthParamsRef.current = true;
      setResetToken(resetTok);
      setMode("reset");
      setAlert({
        type: "info",
        title: "Set New Password",
        message: "Please enter and confirm your new password below.",
      });
    }
  }, [searchParams]);

  const doLogin = async (data: Signin) => {
    setLoading(true);
    setAlert(null);
    setUserEmail(data.email);
    try {
      const token = await signinAuthentication(data);
      dispatch(setToken(token));
      showToast.success("Welcome back!");
      router.push("/panel");
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const status = error.response.status;
        const detail = error.response.data?.detail || "";
        if (status === 401) {
          if (detail.toLowerCase().includes("not confirmed")) {
            setAlert({
              type: "warning",
              title: "Email Not Confirmed",
              message:
                "Your account is not confirmed yet. Please check your inbox or resend the link.",
              showResend: true,
            });
            showToast.warning(
              "Your account is not confirmed yet. Please check your inbox or resend the link.",
            );
            return;
          }
          if (detail.toLowerCase().includes("inactive")) {
            setAlert({
              type: "error",
              title: "Account Inactive",
              message:
                "Your account is not active. Please contact support at support@openhubble.com.",
            });
            showToast.error(
              "Your account is not active. Please contact support at support@openhubble.com.",
            );
            return;
          }
          showToast.error(detail || "Invalid email or password");
          return;
        }
        if (status === 422) {
          showToast.error(
            getErrorMessage(error, "Please check your email and password."),
          );
          return;
        }
      }
      showToast.error(
        getErrorMessage(error, "An unexpected error occurred during sign in."),
      );
    } finally {
      setLoading(false);
    }
  };

  const doRegister = async (data: Signup) => {
    setLoading(true);
    setAlert(null);
    setUserEmail(data.email);
    try {
      const res = await signupAuthentication(data);
      setAlert({
        type: "info",
        title: "Registration Successful",
        message:
          res.message ||
          "Please check your email inbox to confirm your account before signing in.",
        showResend: true,
      });
      showToast.success(
        res.message ||
          "Please check your email inbox to confirm your account before signing in.",
      );
      setMode("login");
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        showToast.error(getErrorMessage(error, "Registration failed"));
      } else {
        showToast.error("Error during registration");
      }
    } finally {
      setLoading(false);
    }
  };

  const doForget = async (data: Forgot) => {
    setLoading(true);
    setAlert(null);
    try {
      await forgotPassword(data);
      setAlert({
        type: "success",
        title: "Check Your Inbox",
        message:
          "If your email is registered, instructions to reset your password have been sent.",
      });
      showToast.success(
        "If your email is registered, instructions to reset your password have been sent.",
      );
    } catch (error) {
      showToast.error(
        getErrorMessage(error, "Error sending reset password email"),
      );
    } finally {
      setLoading(false);
    }
  };

  const doResetPassword = async (data: ResetPassword) => {
    if (!resetToken) {
      showToast.error("Missing password reset token.");
      return;
    }
    if (data.new_password !== data.confirm_password) {
      showToast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    setAlert(null);
    try {
      const res = await resetPassword({
        token: resetToken,
        new_password: data.new_password,
        confirm_password: data.confirm_password,
      });
      setAlert({
        type: "success",
        title: "Password Reset Complete",
        message:
          res.message || "Your password has been changed. Please sign in.",
      });
      showToast.success(
        res.message || "Your password has been changed. Please sign in.",
      );
      setMode("login");
      setResetToken(null);
    } catch (error) {
      showToast.error(
        getErrorMessage(error, "An error occurred while resetting password."),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendLink = async () => {
    if (!userEmail) {
      showToast.error("Please enter your email in the login form first.");
      return;
    }
    setLoading(true);
    try {
      const res = await resendConfirmationEmail({ email: userEmail });
      showToast.success(res.message || "Confirmation link sent!");
    } catch (error) {
      showToast.error(
        getErrorMessage(error, "Failed to resend confirmation email."),
      );
    } finally {
      setLoading(false);
    }
  };

  const modeTitles: Record<modeType, string> = {
    login: "Sign In",
    register: "Create Account",
    forgot: "Reset Password",
    reset: "New Password",
  };

  const modeSubtitles: Record<modeType, string> = {
    login: "Welcome back. Enter your details to continue.",
    register: "Create an account to get started.",
    forgot: "Enter your email and we’ll send you a reset link.",
    reset: "Choose a new password for your account.",
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        display: "flex",
      }}
    >
      <Grid container sx={{ minHeight: "100vh", width: "100%" }}>
        {/* Left Branding Panel */}
        <Grid size={{ xs: 0, md: 6, lg: 7 }}>
          <Box
            sx={{
              height: "100%",
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              justifyContent: "space-between",
              backgroundColor: "#F0EDE6",
              px: { md: 8, lg: 12 },
              py: 8,
              borderRight: "1px solid",
              borderColor: "divider",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Subtle decorative element */}
            <Box
              sx={{
                position: "absolute",
                top: -80,
                right: -80,
                width: 280,
                height: 280,
                borderRadius: "50%",
                backgroundColor: "success.main",
                opacity: 0.06,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: -120,
                left: -60,
                width: 320,
                height: 320,
                borderRadius: "50%",
                backgroundColor: "success.main",
                opacity: 0.04,
              }}
            />

            <Box>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: "success.main",
                  mb: 5,
                }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 600,
                  letterSpacing: "-0.03em",
                  mb: 1.5,
                  lineHeight: 1.1,
                }}
              >
                Since
              </Typography>
              <Typography
                variant="h5"
                color="text.secondary"
                sx={{
                  fontWeight: 400,
                  lineHeight: 1.5,
                  mb: 3,
                }}
              >
                Every moment counts.
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  maxWidth: 340,
                  lineHeight: 1.75,
                  opacity: 0.9,
                }}
              >
                A simple way to keep track of the things that matter.
              </Typography>
            </Box>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ opacity: 0.7 }}
            >
              © {new Date().getFullYear()} Since · Amirhossein Mohammadi
            </Typography>
          </Box>
        </Grid>

        {/* Right Form Area */}
        <Grid size={{ xs: 12, md: 6, lg: 5 }}>
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: { xs: 3, sm: 4, md: 5 },
              py: 6,
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: 420,
              }}
            >
              {/* Header */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    mb: 1,
                  }}
                >
                  {modeTitles[mode]}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.6 }}
                >
                  {modeSubtitles[mode]}
                </Typography>
              </Box>

              {/* Status Alert */}
              {alert && (
                <Alert
                  severity={alert.type}
                  sx={{
                    mb: 3,
                    borderRadius: 2,
                    "& .MuiAlert-message": { width: "100%" },
                  }}
                  action={
                    alert.showResend ? (
                      <Button
                        color="inherit"
                        size="small"
                        onClick={handleResendLink}
                        disabled={loading}
                        sx={{ textTransform: "none", fontWeight: 500 }}
                      >
                        Resend
                      </Button>
                    ) : undefined
                  }
                >
                  <AlertTitle sx={{ fontWeight: 600 }}>
                    {alert.title}
                  </AlertTitle>
                  {alert.message}
                </Alert>
              )}

              {/* Form */}
              <Box sx={{ mb: 3 }}>
                {mode === "login" && (
                  <Form<Signin>
                    name="login"
                    callback={doLogin}
                    button="Sign In"
                    btnStyle={{ fullWidth: true, disabled: loading }}
                  />
                )}
                {mode === "register" && (
                  <Form<Signup>
                    name="register"
                    callback={doRegister}
                    button="Create Account"
                    btnStyle={{ disabled: loading, fullWidth: true }}
                  />
                )}
                {mode === "forgot" && (
                  <Form<Forgot>
                    name="forget"
                    callback={doForget}
                    button="Send Reset Link"
                    btnStyle={{ disabled: loading, fullWidth: true }}
                  />
                )}
                {mode === "reset" && (
                  <Form<ResetPassword>
                    name="reset"
                    callback={doResetPassword}
                    button="Update Password"
                    btnStyle={{ disabled: loading, fullWidth: true }}
                  />
                )}
              </Box>

              {/* Forgot password link */}
              {mode === "login" && (
                <Box sx={{ textAlign: "right", mb: 3 }}>
                  <MUILink
                    component="button"
                    variant="body2"
                    onClick={() => changeMode("forgot")}
                    sx={{
                      color: "text.secondary",
                      textDecoration: "none",
                      "&:hover": {
                        color: "text.primary",
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Forgot password?
                  </MUILink>
                </Box>
              )}

              {/* Divider + mode switch */}
              <Stack spacing={2.5} alignItems="center">
                <Divider sx={{ width: "100%" }} />
                <Button
                  fullWidth
                  variant="text"
                  color="secondary"
                  onClick={() =>
                    changeMode(mode === "login" ? "register" : "login")
                  }
                  sx={{
                    textTransform: "none",
                    fontWeight: 500,
                    py: 1.25,
                  }}
                >
                  {mode === "login"
                    ? "Don't have an account? Register"
                    : "Already registered? Sign In"}
                </Button>
              </Stack>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

const AuthFallback = () => (
  <Box
    sx={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "background.default",
    }}
  >
    <CircularProgress />
  </Box>
);

const Auth = () => {
  return (
    <Suspense fallback={<AuthFallback />}>
      <AuthContent />
    </Suspense>
  );
};

export default Auth;

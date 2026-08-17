"use client";

import React, { ReactElement, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";

import { Person, Lock, Email, CheckCircle, Delete } from "@mui/icons-material";

import { useDispatch, useSelector } from "react-redux";

import Form from "@/components/form.component";
import { getErrorMessage, showToast } from "@/utils/toast.util";

import {
  updateProfile,
  updatePassword,
  updateEmail,
} from "@/api/services/user.service";

import { setUser } from "@/redux/slices/user.slice";
import { RootState } from "@/redux/store";

import {
  UpdateProfilePayload,
  UpdatePasswordPayload,
  UpdateEmailPayload,
} from "@/types/user.type";

type ActiveSection = "profile" | "password" | "email" | "danger";

interface NavItem {
  id: ActiveSection;
  label: string;
  description: string;
  icon: ReactElement;
  danger?: boolean;
}

export default function SettingsPage() {
  const dispatch = useDispatch();

  const currentUser = useSelector((state: RootState) => state.user.user);

  const [activeSection, setActiveSection] = useState<ActiveSection>("profile");

  const [loading, setLoading] = useState(false);

  const firstName = currentUser?.first_name || "";
  const lastName = currentUser?.last_name || "";

  const fullName = `${firstName} ${lastName}`.trim() || "User";

  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";

  const handleUpdateProfile = async (data: UpdateProfilePayload) => {
    setLoading(true);

    try {
      const updatedUser = await updateProfile(data);

      dispatch(setUser(updatedUser));

      showToast.success("Profile updated successfully.");
    } catch (error) {
      showToast.error(getErrorMessage(error, "Failed to update profile."));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (data: UpdatePasswordPayload) => {
    if (data.new_password !== data.confirm_password) {
      showToast.error("New passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const updatedUser = await updatePassword(data);

      dispatch(setUser(updatedUser));

      showToast.success("Password changed successfully.");
    } catch (error) {
      showToast.error(getErrorMessage(error, "Failed to change password."));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async (data: UpdateEmailPayload) => {
    setLoading(true);

    try {
      const updatedUser = await updateEmail(data);

      dispatch(setUser(updatedUser));

      showToast.success("Email address updated successfully.");
    } catch (error) {
      showToast.error(getErrorMessage(error, "Failed to update email."));
    } finally {
      setLoading(false);
    }
  };

  const navItems: NavItem[] = [
    {
      id: "profile",
      label: "Profile",
      description: "Personal information",
      icon: <Person fontSize="small" />,
    },
    {
      id: "password",
      label: "Password",
      description: "Security & password",
      icon: <Lock fontSize="small" />,
    },
    {
      id: "email",
      label: "Email",
      description: "Email address",
      icon: <Email fontSize="small" />,
    },
    {
      id: "danger",
      label: "Danger Zone",
      description: "Destructive actions",
      icon: <Delete fontSize="small" />,
      danger: true,
    },
  ];

  return (
    <Box
      sx={{
        maxWidth: 1100,
        mx: "auto",
        py: 1,
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            letterSpacing: "-0.025em",
            color: "text.primary",
          }}
        >
          Settings
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
          Manage your account and security preferences.
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 3,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
          bgcolor: "background.paper",
        }}
      >
        <Avatar
          sx={{
            width: 52,
            height: 52,
            bgcolor: "primary.main",
            color: "primary.contrastText",
            fontWeight: 700,
          }}
        >
          {initials}
        </Avatar>

        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                color: "text.primary",
              }}
            >
              {fullName}
            </Typography>

            {currentUser?.is_active && (
              <Chip
                icon={<CheckCircle />}
                label="Active"
                color="success"
                size="small"
                variant="outlined"
                sx={{
                  height: 23,
                  "& .MuiChip-icon": {
                    fontSize: 15,
                  },
                }}
              />
            )}
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.25,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {currentUser?.email || "No email address"}
          </Typography>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
          <Paper
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 1.75,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "text.primary",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Account
              </Typography>
            </Box>

            <List disablePadding sx={{ p: 0.75 }}>
              {navItems.map((item) => {
                const selected = activeSection === item.id;

                return (
                  <ListItemButton
                    key={item.id}
                    selected={selected}
                    onClick={() => setActiveSection(item.id)}
                    sx={{
                      minHeight: 54,
                      mb: 0.5,
                      px: 1.25,
                      borderRadius: 1.25,

                      color: selected
                        ? item.danger
                          ? "error.main"
                          : "primary.main"
                        : "text.secondary",

                      "&.Mui-selected": {
                        bgcolor: item.danger
                          ? "rgba(211, 47, 47, 0.08)"
                          : "action.selected",
                      },

                      "&.Mui-selected:hover": {
                        bgcolor: item.danger
                          ? "rgba(211, 47, 47, 0.12)"
                          : "action.hover",
                      },

                      "&:hover": {
                        bgcolor: "action.hover",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 38,
                        color: "inherit",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>

                    <ListItemText
                      primary={item.label}
                      secondary={item.description}
                      slotProps={{
                        primary: {
                          sx: {
                            fontSize: "0.825rem",
                            fontWeight: selected ? 600 : 500,
                          },
                        },
                        secondary: {
                          sx: {
                            fontSize: "0.7rem",
                            mt: 0.15,
                          },
                        },
                      }}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 8, lg: 9 }}>
          <Paper
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            {activeSection === "profile" && (
              <Box>
                <SectionHeader
                  title="Profile"
                  description="Update your personal information."
                />

                <Box sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                  <Form
                    name="user_profile"
                    callback={handleUpdateProfile}
                    def={{ ...currentUser }}
                    button="Save Changes"
                    btnStyle={{ disabled: loading }}
                  />
                </Box>
              </Box>
            )}

            {activeSection === "password" && (
              <Box>
                <SectionHeader
                  title="Password & Security"
                  description="Keep your account secure with a strong password."
                />

                <Box sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                  <Form
                    name="user_password"
                    callback={handleUpdatePassword}
                    button="Change Password"
                    btnStyle={{ disabled: loading }}
                  />
                </Box>
              </Box>
            )}

            {activeSection === "email" && (
              <Box>
                <SectionHeader
                  title="Email Address"
                  description="Manage the email address associated with your account."
                />

                <Box sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                  <Box
                    sx={{
                      mb: 3,
                      px: 2,
                      py: 1.5,
                      borderRadius: 1.5,
                      bgcolor: "action.hover",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Current email
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        mt: 0.25,
                        fontWeight: 600,
                      }}
                    >
                      {currentUser?.email || "—"}
                    </Typography>
                  </Box>

                  <Form
                    name="user_email"
                    callback={handleUpdateEmail}
                    def={{
                      email: currentUser?.email || "",
                    }}
                    button="Update Email"
                    btnStyle={{ disabled: loading }}
                  />
                </Box>
              </Box>
            )}

            {activeSection === "danger" && (
              <Box>
                <SectionHeader
                  title="Danger Zone"
                  description="Irreversible actions affecting your account."
                  danger
                />

                <Box sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                  <Box
                    sx={{
                      p: 2.5,
                      border: "1px solid",
                      borderColor: "error.main",
                      borderRadius: 1.5,
                      bgcolor: "rgba(211, 47, 47, 0.04)",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: {
                          xs: "flex-start",
                          sm: "center",
                        },
                        justifyContent: "space-between",
                        flexDirection: {
                          xs: "column",
                          sm: "row",
                        },
                        gap: 2,
                      }}
                    >
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 700,
                            color: "text.primary",
                          }}
                        >
                          Delete account
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mt: 0.5,
                            maxWidth: 520,
                          }}
                        >
                          Permanently remove your account and all associated
                          data.
                        </Typography>
                      </Box>

                      <Tooltip
                        title="Account deletion is currently unavailable"
                        arrow
                      >
                        <span>
                          <Button
                            // disabled
                            variant="contained"
                            color="error"
                            startIcon={<Delete />}
                            sx={{
                              flexShrink: 0,
                              textTransform: "none",
                              fontWeight: 600,
                            }}
                          >
                            Delete Account
                          </Button>
                        </span>
                      </Tooltip>
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

interface SectionHeaderProps {
  title: string;
  description: string;
  danger?: boolean;
}

function SectionHeader({
  title,
  description,
  danger = false,
}: SectionHeaderProps) {
  return (
    <>
      <Box
        sx={{
          px: { xs: 2.5, sm: 3.5 },
          py: 2.75,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: danger ? "error.main" : "text.primary",
          }}
        >
          {title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {description}
        </Typography>
      </Box>

      <Divider />
    </>
  );
}

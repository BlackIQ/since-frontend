"use client";

import React, { ReactElement, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  Button,
  Tooltip,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
  Grid,
} from "@mui/material";
import {
  Person,
  Lock,
  Email,
  DeleteForever,
  CheckCircle,
} from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";

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

type ActiveTabType = "profile" | "password" | "email" | "danger";

interface NavItem {
  id: ActiveTabType;
  label: string;
  icon: ReactElement;
  danger?: boolean;
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<ActiveTabType>("profile");
  const [loading, setLoading] = useState(false);

  const currentUser = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();

  const fullName =
    `${currentUser?.first_name || ""} ${currentUser?.last_name || ""}`.trim() ||
    "User Profile";
  const userInitials =
    `${currentUser?.first_name?.[0] || ""}${currentUser?.last_name?.[0] || ""}`.toUpperCase() ||
    "U";

  const handleUpdateProfile = async (data: UpdateProfilePayload) => {
    setLoading(true);
    try {
      const updatedUser = await updateProfile(data);
      dispatch(setUser(updatedUser));
      showToast.success("Profile updated successfully!");
    } catch (error) {
      showToast.error(getErrorMessage(error, "Failed to update profile."));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (data: UpdatePasswordPayload) => {
    if (data.new_password !== data.confirm_password) {
      showToast.error("New passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const updatedUser = await updatePassword(data);
      dispatch(setUser(updatedUser));
      showToast.success("Password changed successfully!");
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
      showToast.success("Email address updated!");
    } catch (error) {
      showToast.error(getErrorMessage(error, "Failed to update email."));
    } finally {
      setLoading(false);
    }
  };

  const navItems: NavItem[] = [
    {
      id: "profile",
      label: "Profile Information",
      icon: <Person fontSize="small" />,
      danger: false,
    },
    {
      id: "password",
      label: "Password & Security",
      icon: <Lock fontSize="small" />,
      danger: false,
    },
    {
      id: "email",
      label: "Email Preferences",
      icon: <Email fontSize="small" />,
      danger: false,
    },
    {
      id: "danger",
      label: "Danger Zone",
      icon: <DeleteForever fontSize="small" />,
      danger: true,
    },
  ] as const;

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", py: 2 }}>
      {/* Top Banner Card */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          gap: 2.5,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
        }}
      >
        <Avatar
          sx={{
            width: 64,
            height: 64,
            bgcolor: "primary.main",
            color: "primary.contrastText",
            fontSize: "1.5rem",
            fontWeight: 700,
          }}
        >
          {userInitials}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}
          >
            <Typography
              variant="h5"
              color="text.primary"
              sx={{
                fontWeight: 700,
              }}
            >
              {fullName}
            </Typography>
            {currentUser?.is_active && (
              <Chip
                icon={<CheckCircle fontSize="small" />}
                label="Active Account"
                color="success"
                size="small"
                variant="outlined"
                sx={{ height: 24, fontSize: "0.75rem" }}
              />
            )}
          </Box>
          <Typography variant="body2" color="text.secondary">
            {currentUser?.email || "No email set"}
          </Typography>
        </Box>
      </Paper>

      {/* Main Grid: Sidebar + Content */}
      <Grid container spacing={3}>
        {/* Left Navigation Sidebar */}
        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}
            >
              <Typography
                color="text.secondary"
                sx={{
                  fontWeight: 700,
                }}
              >
                Settings Navigation
              </Typography>
            </Box>
            <List disablePadding>
              {navItems.map((item) => {
                const isSelected = activeSection === item.id;
                return (
                  <ListItemButton
                    key={item.id}
                    selected={isSelected}
                    onClick={() => setActiveSection(item.id)}
                    sx={{
                      py: 1.5,
                      px: 2,
                      borderLeft: isSelected
                        ? "3px solid"
                        : "3px solid transparent",
                      borderLeftColor: isSelected
                        ? item.danger
                          ? "error.main"
                          : "primary.main"
                        : "transparent",
                      color: isSelected
                        ? item.danger
                          ? "error.main"
                          : "primary.main"
                        : "text.secondary",
                      "&.Mui-selected": {
                        bgcolor: item.danger
                          ? "rgba(211, 47, 47, 0.08)"
                          : "action.selected",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 36,
                        color: isSelected
                          ? item.danger
                            ? "error.main"
                            : "primary.main"
                          : "text.secondary",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      sx={{
                        fontSize: "0.875rem",
                        fontWeight: isSelected ? 600 : 400,
                      }}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </Paper>
        </Grid>

        {/* Right Content Panel */}
        <Grid size={{ xs: 12, md: 8, lg: 9 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3.5,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              minHeight: 400,
            }}
          >
            {/* Profile Section */}
            {activeSection === "profile" && (
              <Box>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    color="text.primary"
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    Profile Details
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Update your public display name and account details.
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                <Form
                  name="user_profile"
                  callback={handleUpdateProfile}
                  def={{
                    first_name: currentUser?.first_name || "",
                    last_name: currentUser?.last_name || "",
                  }}
                  button="Save Changes"
                  btnStyle={{ disabled: loading }}
                />
              </Box>
            )}

            {/* Password Section */}
            {activeSection === "password" && (
              <Box>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    color="text.primary"
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    Password & Security
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ensure your account is using a long, random password to stay
                    secure.
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                <Form
                  name="user_password"
                  callback={handleUpdatePassword}
                  button="Change Password"
                  btnStyle={{ disabled: loading }}
                />
              </Box>
            )}

            {/* Email Section */}
            {activeSection === "email" && (
              <Box>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    color="text.primary"
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    Email Address
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your current registered email address is{" "}
                    <strong>{currentUser?.email || "—"}</strong>.
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                <Form
                  name="user_email"
                  callback={handleUpdateEmail}
                  def={{ email: currentUser?.email || "" }}
                  button="Update Email Address"
                  btnStyle={{ disabled: loading }}
                />
              </Box>
            )}

            {/* Danger Zone Section */}
            {activeSection === "danger" && (
              <Box>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    color="error.main"
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    Danger Zone
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Irreversible and destructive actions regarding your cloud
                    account.
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    border: "1px solid",
                    borderColor: "error.main",
                    borderRadius: 1.5,
                    bgcolor: "rgba(211, 47, 47, 0.03)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography
                      variant="subtitle2"
                      color="text.primary"
                      sx={{
                        fontWeight: 700,
                      }}
                    >
                      Delete Account
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: "0.8rem" }}
                    >
                      Once deleted, all your hosts, groups, and tags will be
                      purged forever.
                    </Typography>
                  </Box>

                  <Tooltip
                    title="Account deletion is currently disabled"
                    arrow
                    placement="top"
                  >
                    <span>
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<DeleteForever />}
                        disabled
                        sx={{ textTransform: "none", fontWeight: 600 }}
                      >
                        Delete Account
                      </Button>
                    </span>
                  </Tooltip>
                </Paper>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

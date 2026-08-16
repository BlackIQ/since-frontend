"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import {
  Box,
  CssBaseline,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  Menu as MenuIcon,
  AccessTime,
  Home,
  Logout,
  Person,
  Circle,
} from "@mui/icons-material";

import { styled } from "@mui/material/styles";

import { useAppSelector } from "@/redux/hooks";
import { setUser, clearUser } from "@/redux/slices/user.slice";
import { clearToken } from "@/redux/slices/token.slice";

import { me } from "@/api/services/user.service";
import Loading from "@/components/loading.component";

const drawerWidth = 240;
const collapsedWidth = 72;

const Drawer = styled("aside", {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open: boolean }>(({ theme, open }) => ({
  width: open ? drawerWidth : collapsedWidth,
  flexShrink: 0,

  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.standard,
  }),

  "& > .drawer-paper": {
    position: "fixed",
    inset: "0 auto 0 0",

    width: open ? drawerWidth : collapsedWidth,
    height: "100vh",

    display: "flex",
    flexDirection: "column",

    overflow: "hidden",

    backgroundColor: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,

    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.standard,
    }),
  },
}));

export default function PanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  const { token, user } = useAppSelector((state) => state);

  useEffect(() => {
    if (!token.token) {
      router.replace("/auth");
      return;
    }

    const fetchUser = async () => {
      try {
        const data = await me();
        dispatch(setUser(data));
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token.token, dispatch, router]);

  const handleLogout = () => {
    dispatch(clearUser());
    dispatch(clearToken());
    router.replace("/auth");
  };

  const navItems = [
    {
      label: "Overview",
      path: "/panel",
      icon: <Home fontSize="small" />,
    },
    {
      label: "Counters",
      path: "/panel/counters",
      icon: <AccessTime fontSize="small" />,
    },
  ];

  const displayName =
    user.user?.display_name ||
    user.user?.first_name ||
    user.user?.username ||
    "Account";

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loading />
      </Box>
    );
  }

  return (
    <>
      <CssBaseline />

      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <Drawer open={open}>
          <Box className="drawer-paper">
            <Box
              sx={{
                height: 72,
                display: "flex",
                alignItems: "center",
                px: open ? 2 : 1.5,
              }}
            >
              {open && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <Circle color="success" fontSize="small" sx={{ mr: 2 }} />
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    Since
                  </Typography>
                </Box>
              )}

              <Box sx={{ flexGrow: 1 }} />

              <IconButton
                onClick={() => setOpen((value) => !value)}
                size="small"
                sx={{
                  color: "text.secondary",
                  ml: open ? 1 : 0,
                }}
              >
                <MenuIcon fontSize="small" />
              </IconButton>
            </Box>

            <Divider />

            <Box sx={{ px: 1.25, py: 2 }}>
              <List disablePadding sx={{ mt: open ? 1 : 0 }}>
                {navItems.map((item) => {
                  const active = pathname === item.path;

                  return (
                    <Tooltip
                      key={item.path}
                      title={!open ? item.label : ""}
                      placement="right"
                      arrow
                    >
                      <ListItemButton
                        onClick={() => router.push(item.path)}
                        selected={active}
                        sx={{
                          minHeight: 42,
                          mb: 0.5,
                          px: open ? 1.25 : 1.5,
                          borderRadius: 1.5,
                          justifyContent: open ? "initial" : "center",
                          color: active ? "primary.main" : "text.secondary",
                          "&.Mui-selected": {
                            bgcolor: "action.selected",
                          },
                          "&.Mui-selected:hover": {
                            bgcolor: "action.hover",
                          },
                          "&:hover": {
                            bgcolor: "action.hover",
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 1.5 : 0,
                            color: "inherit",
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>

                        {open && <ListItemText primary={item.label} />}
                      </ListItemButton>
                    </Tooltip>
                  );
                })}
              </List>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ px: 1.25, pb: 1.5 }}>
              <Divider sx={{ mb: 1.5 }} />

              <Tooltip title={!open ? "Settings" : ""} placement="right" arrow>
                <ListItemButton
                  onClick={() => router.push("/panel/settings")}
                  selected={pathname == "/panel/settings"}
                  sx={{
                    minHeight: 42,
                    mb: 0.5,
                    px: open ? 1.25 : 1.5,
                    borderRadius: 1.5,
                    justifyContent: open ? "initial" : "center",
                    color:
                      pathname == "/panel/settings"
                        ? "primary.main"
                        : "text.secondary",
                    "&.Mui-selected": {
                      bgcolor: "action.selected",
                    },
                    "&.Mui-selected:hover": {
                      bgcolor: "action.hover",
                    },
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: "inherit",
                      minWidth: 0,
                      mr: open ? 1.5 : 0,
                    }}
                  >
                    <Person
                      fontSize="small"
                      sx={{
                        color: "inherit",
                      }}
                    />
                  </ListItemIcon>

                  {open && (
                    <ListItemText
                      primary={displayName}
                      sx={{
                        color: "inherit",
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>

              <Tooltip title={!open ? "Logout" : ""} placement="right" arrow>
                <ListItemButton
                  onClick={handleLogout}
                  sx={{
                    color: "error.main",
                    minHeight: 42,
                    mt: 0.5,
                    px: open ? 1.25 : 1.5,
                    borderRadius: 1.5,
                    justifyContent: open ? "initial" : "center",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 1.5 : 0,
                      color: "inherit",
                    }}
                  >
                    <Logout
                      fontSize="small"
                      sx={{
                        color: "inherit",
                      }}
                    />
                  </ListItemIcon>

                  {open && <ListItemText primary="Logout" color="error" />}
                </ListItemButton>
              </Tooltip>
            </Box>
          </Box>
        </Drawer>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minWidth: 0,
            minHeight: "100vh",
            p: { xs: 2, md: 3 },
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
}

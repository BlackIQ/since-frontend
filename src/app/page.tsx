"use client";

import { useRouter } from "next/navigation";
import {
  Typography,
  Box,
  Button,
  Stack,
  Container,
  Divider,
  Link as MUILink,
} from "@mui/material";

export default function Home() {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Navbar */}
      <Box
        component="header"
        sx={{
          px: { xs: 3, md: 6 },
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "background.default",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <Box
          onClick={() => router.push("/")}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            cursor: "pointer",
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "success.main",
            }}
          />
          <Typography
            sx={{
              fontWeight: 600,
              letterSpacing: "-0.02em",
              fontSize: "1.05rem",
            }}
          >
            Since
          </Typography>
        </Box>

        <Button
          variant="outlined"
          size="small"
          onClick={() => router.push("/auth")}
          sx={{
            borderColor: "divider",
            color: "text.primary",
            px: 2.25,
            height: 34,
            fontSize: "0.8125rem",
            "&:hover": {
              borderColor: "text.primary",
              backgroundColor: "transparent",
            },
          }}
        >
          Sign In
        </Button>
      </Box>

      {/* Hero */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          px: { xs: 3, md: 6 },
          py: { xs: 10, md: 14 },
        }}
      >
        <Container maxWidth="sm" disableGutters>
          <Stack spacing={4}>
            <Box
              sx={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                backgroundColor: "success.main",
              }}
            />

            <Box>
              <Typography
                sx={{
                  fontWeight: 600,
                  letterSpacing: "-0.035em",
                  fontSize: { xs: "2.35rem", sm: "2.85rem", md: "3.15rem" },
                  lineHeight: 1.12,
                  mb: 3,
                }}
              >
                The moment you decided
                <br />
                to change something.
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  fontSize: { xs: "1.05rem", md: "1.125rem" },
                  lineHeight: 1.65,
                  maxWidth: 420,
                }}
              >
                Since helps you remember the day you started — and how far
                you’ve come since then.
              </Typography>
            </Box>

            <Box sx={{ pt: 1 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => router.push("/auth")}
                sx={{
                  px: 3.5,
                  py: 1.35,
                  fontSize: "0.9375rem",
                }}
              >
                Get Started
              </Button>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Why / What */}
      <Box
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          backgroundColor: "#F0EDE6",
          px: { xs: 3, md: 6 },
          py: { xs: 7, md: 9 },
        }}
      >
        <Container maxWidth="md" disableGutters>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 5, md: 8 }}
            divider={
              <Divider
                orientation="vertical"
                flexItem
                sx={{ display: { xs: "none", md: "block" } }}
              />
            }
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 1.5,
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  fontSize: "0.75rem",
                }}
              >
                WHY IT EXISTS
              </Typography>
              <Typography
                color="text.primary"
                sx={{ lineHeight: 1.7, fontSize: "0.975rem" }}
              >
                Most people forget the exact day they decided to change. Since
                gives that moment a permanent place.
              </Typography>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 1.5,
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  fontSize: "0.75rem",
                }}
              >
                WHAT IT DOES
              </Typography>
              <Typography
                color="text.primary"
                sx={{ lineHeight: 1.7, fontSize: "0.975rem" }}
              >
                A quiet counter for the things that matter — habits, decisions,
                beginnings. Nothing more.
              </Typography>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Creator + Open Source */}
      <Box
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          px: { xs: 3, md: 6 },
          py: { xs: 6, md: 7 },
        }}
      >
        <Container maxWidth="md" disableGutters>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 5, sm: 8 }}
            justifyContent="space-between"
          >
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 1.25,
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  fontSize: "0.75rem",
                }}
              >
                CREATED BY
              </Typography>
              <Typography
                color="text.primary"
                sx={{ fontSize: "0.975rem", mb: 0.75 }}
              >
                Amirhossein Mohammadi
              </Typography>
              <Typography
                color="text.secondary"
                sx={{
                  fontSize: "0.875rem",
                  lineHeight: 1.6,
                  maxWidth: 340,
                  mb: 1.5,
                }}
              >
                Building simple tools for the moments that quietly matter.
              </Typography>
              <MUILink
                href="https://amirhossein.info"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  fontSize: "0.875rem",
                  color: "text.secondary",
                  textDecoration: "none",
                  "&:hover": {
                    color: "text.primary",
                    textDecoration: "underline",
                  },
                }}
              >
                amirhossein.info
              </MUILink>
            </Box>

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 1.25,
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  fontSize: "0.75rem",
                }}
              >
                OPEN SOURCE
              </Typography>
              <Stack spacing={1}>
                <MUILink
                  href="https://github.com/BlackIQ/since-frontend"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    fontSize: "0.875rem",
                    color: "text.secondary",
                    textDecoration: "none",
                    "&:hover": {
                      color: "text.primary",
                      textDecoration: "underline",
                    },
                  }}
                >
                  Frontend →
                </MUILink>
                <MUILink
                  href="https://github.com/BlackIQ/since-backend"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    fontSize: "0.875rem",
                    color: "text.secondary",
                    textDecoration: "none",
                    "&:hover": {
                      color: "text.primary",
                      textDecoration: "underline",
                    },
                  }}
                >
                  Backend →
                </MUILink>
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          px: { xs: 3, md: 6 },
          py: 2.75,
          borderTop: "1px solid",
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="caption" color="text.secondary">
          © {new Date().getFullYear()} Since · Amirhossein Mohammadi
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Every moment counts.
        </Typography>
      </Box>
    </Box>
  );
}

"use client";

import { useRouter } from "next/navigation";

import { Typography, Box, Button } from "@mui/material";

export default function Home() {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "background.default",
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          maxWidth: 800,
          px: { xs: 2, md: 4 },
          py: 4,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            mb: 2,
            fontWeight: 600,
          }}
        >
          Since
        </Typography>

        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Track the time since you started.
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Keep track of the moments that matter.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => router.push("/auth")}
        >
          Get Started
        </Button>
      </Box>
    </Box>
  );
}

"use client";

import { Add } from "@mui/icons-material";
import { Box, Card, CardContent, Typography } from "@mui/material";

interface CreateCounterCardProps {
  onClick: () => void;
}

export default function CreateCounterCard({ onClick }: CreateCounterCardProps) {
  return (
    <Card
      onClick={onClick}
      elevation={0}
      sx={{
        height: "100%",
        minHeight: 260,
        border: "1px dashed",
        borderColor: "divider",
        borderRadius: 2,
        cursor: "pointer",
        transition: "all 0.2s ease",
        backgroundColor: "transparent",

        "&:hover": {
          borderColor: "primary.main",
          backgroundColor: "rgba(59, 130, 246, 0.04)",
        },
      }}
    >
      <CardContent
        sx={{
          height: "100%",
          minHeight: 260,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(59, 130, 246, 0.10)",
            color: "primary.main",
            mb: 2,
          }}
        >
          <Add />
        </Box>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 0.5,
          }}
        >
          Create Counter
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            maxWidth: 220,
          }}
        >
          Start tracking something that matters to you.
        </Typography>
      </CardContent>
    </Card>
  );
}

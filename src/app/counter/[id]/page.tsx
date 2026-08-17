"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Skeleton,
  Container,
  Divider,
} from "@mui/material";
import {
  AccessTime,
  CheckCircle,
  Public,
  CalendarMonth,
} from "@mui/icons-material";
import { format, isValid, differenceInDays } from "date-fns";

import { getPublicCounter } from "@/api/services/counter.service";
import { PublicCounterRead } from "@/types/counter.type";

export default function PublicCounterPage() {
  const params = useParams();
  const id = params?.id as string;

  const [counter, setCounter] = useState<PublicCounterRead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchCounter = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPublicCounter(id);
        setCounter(data);
      } catch (err) {
        console.error(err);
        setError("This counter is not available or is private.");
      } finally {
        setLoading(false);
      }
    };

    fetchCounter();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Skeleton variant="rounded" height={320} sx={{ borderRadius: 3 }} />
      </Container>
    );
  }

  if (error || !counter) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: "center" }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: 600,
          }}
        >
          Counter not found
        </Typography>
        <Typography color="text.secondary">
          {error || "This counter does not exist or is set to private."}
        </Typography>
      </Container>
    );
  }

  const startDate = counter.started_at ? new Date(counter.started_at) : null;
  const endDate = counter.ended_at ? new Date(counter.ended_at) : null;
  const isActive = counter.status === "active";

  const days =
    startDate && isValid(startDate)
      ? differenceInDays(
          endDate && isValid(endDate) ? endDate : new Date(),
          startDate,
        )
      : 0;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background:
          "linear-gradient(180deg, rgba(59,130,246,0.06) 0%, transparent 40%)",
        py: 6,
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              px: 3,
              py: 2,
              backgroundColor: "rgba(59, 130, 246, 0.08)",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Public fontSize="small" color="primary" />
            <Typography
              variant="body2"
              color="primary"
              sx={{
                fontWeight: 600,
              }}
            >
              Public Counter
            </Typography>
          </Box>

          <CardContent sx={{ p: 3.5 }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, mb: 1.5, lineHeight: 1.2 }}
            >
              {counter.title}
            </Typography>

            <Box sx={{ display: "flex", gap: 1, mb: 2.5, flexWrap: "wrap" }}>
              <Chip
                icon={isActive ? <AccessTime /> : <CheckCircle />}
                label={isActive ? "Active" : "Completed"}
                size="small"
                color={isActive ? "primary" : "success"}
                variant="outlined"
              />
            </Box>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 3, whiteSpace: "pre-wrap" }}
            >
              {counter.description || "No description provided."}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 3,
              }}
            >
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    mb: 0.5,
                  }}
                >
                  <CalendarMonth fontSize="inherit" />
                  Started
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  {startDate && isValid(startDate)
                    ? format(startDate, "MMM dd, yyyy")
                    : "—"}
                </Typography>
              </Box>

              <Box sx={{ textAlign: "right" }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mb: 0.5 }}
                >
                  {isActive ? "Current streak" : "Total duration"}
                </Typography>
                <Typography
                  variant="h6"
                  color={isActive ? "primary.main" : "text.primary"}
                  sx={{
                    fontWeight: 800,
                  }}
                >
                  {days} {days === 1 ? "day" : "days"}
                </Typography>
              </Box>
            </Box>

            {!isActive && endDate && isValid(endDate) && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="caption" color="text.secondary">
                  Ended on
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  {format(endDate, "MMM dd, yyyy")}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 3, textAlign: "center" }}
        >
          Shared publicly • No account required
        </Typography>
      </Container>
    </Box>
  );
}

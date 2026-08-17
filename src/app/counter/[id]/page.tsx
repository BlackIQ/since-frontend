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
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          backgroundColor: "background.default",
          py: 6,
        }}
      >
        <Container maxWidth="sm">
          <Skeleton
            variant="rounded"
            height={320}
            sx={{
              borderRadius: 3,
              bgcolor: "background.paper",
            }}
          />
        </Container>
      </Box>
    );
  }

  if (error || !counter) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          backgroundColor: "background.default",
          py: 6,
        }}
      >
        <Container maxWidth="sm">
          <Card
            sx={{
              borderRadius: 3,
              textAlign: "center",
              p: 3,
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  fontWeight: 700,
                }}
              >
                Counter not found
              </Typography>

              <Typography color="text.secondary">
                {error || "This counter does not exist or is set to private."}
              </Typography>
            </CardContent>
          </Card>
        </Container>
      </Box>
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
        backgroundColor: "background.default",
        py: { xs: 4, sm: 6 },
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              px: 3,
              py: 1.75,
              backgroundColor: "primary.main",
              color: "primary.contrastText",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Public fontSize="small" />

            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
              }}
            >
              Public Counter
            </Typography>
          </Box>

          <CardContent
            sx={{
              p: { xs: 2.5, sm: 3.5 },
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1.5,
                lineHeight: 1.2,
                color: "text.primary",
              }}
            >
              {counter.title}
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 1,
                mb: 2.5,
                flexWrap: "wrap",
              }}
            >
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
              sx={{
                mb: 3,
                whiteSpace: "pre-wrap",
                lineHeight: 1.8,
              }}
            >
              {counter.description || "No description provided."}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                },
                gap: { xs: 2.5, sm: 3 },
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
                    color: "text.primary",
                  }}
                >
                  {startDate && isValid(startDate)
                    ? format(startDate, "MMM dd, yyyy")
                    : "—"}
                </Typography>
              </Box>

              <Box
                sx={{
                  textAlign: {
                    xs: "left",
                    sm: "right",
                  },
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: "block",
                    mb: 0.5,
                  }}
                >
                  {isActive ? "Current streak" : "Total duration"}
                </Typography>

                <Typography
                  variant="h6"
                  color={isActive ? "primary.main" : "text.primary"}
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  {days} {days === 1 ? "day" : "days"}
                </Typography>
              </Box>
            </Box>

            {!isActive && endDate && isValid(endDate) && (
              <>
                <Divider sx={{ my: 3 }} />

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Ended on
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      mt: 0.25,
                    }}
                  >
                    {format(endDate, "MMM dd, yyyy")}
                  </Typography>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

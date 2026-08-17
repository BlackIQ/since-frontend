"use client";

import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";

import {
  Edit,
  Delete,
  Lock,
  Public,
  AccessTime,
  CheckCircle,
} from "@mui/icons-material";

import { format, isValid, differenceInDays } from "date-fns";
import { CounterRead } from "@/types/counter.type";

interface CounterCardProps {
  counter: CounterRead;
  onClick?: (counter: CounterRead) => void;
  onEdit?: (counter: CounterRead) => void;
  onDelete?: (counter: CounterRead) => void;
}

export default function CounterCard({
  counter,
  onClick,
  onEdit,
  onDelete,
}: CounterCardProps) {
  const startedAt = counter.periods?.[0]?.started_at;

  const startDate = startedAt ? new Date(startedAt) : null;

  const days =
    startDate && isValid(startDate)
      ? differenceInDays(new Date(), startDate)
      : 0;

  return (
    <Card
      onClick={() => onClick?.(counter)}
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        },
      }}
    >
      <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {counter.title}
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 0.75,
                mt: 1,
                flexWrap: "wrap",
              }}
            >
              <Chip
                icon={
                  counter.status === "active" ? <AccessTime /> : <CheckCircle />
                }
                label={counter.status === "active" ? "Active" : "Completed"}
                size="small"
                color={counter.status === "active" ? "primary" : "success"}
                variant="outlined"
              />

              <Chip
                icon={counter.visibility === "public" ? <Public /> : <Lock />}
                label={counter.visibility === "public" ? "Public" : "Private"}
                size="small"
                variant="outlined"
              />
            </Box>
          </Box>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 2,
            minHeight: 40,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {counter.description || "No description provided."}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "flex",
              }}
            >
              Started
            </Typography>

            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
              }}
            >
              {startDate && isValid(startDate)
                ? format(startDate, "MMM dd, yyyy")
                : "—"}
            </Typography>
          </Box>

          {counter.status === "active" && (
            <Box sx={{ textAlign: "right" }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: "flex",
                }}
              >
                Duration
              </Typography>

              <Typography
                variant="body2"
                color="primary.main"
                sx={{
                  fontWeight: 700,
                }}
              >
                {days} {days === 1 ? "day" : "days"}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>

      <CardActions
        sx={{
          px: 2,
          pb: 1.5,
          pt: 0,
          justifyContent: "flex-end",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Tooltip title="Edit">
          <IconButton
            size="small"
            color="primary"
            onClick={() => onEdit?.(counter)}
          >
            <Edit fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Delete">
          <IconButton
            size="small"
            color="error"
            onClick={() => onDelete?.(counter)}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
}

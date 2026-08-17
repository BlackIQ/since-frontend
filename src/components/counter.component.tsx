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
  Replay,
  Flag,
  Share,
} from "@mui/icons-material";
import { format, isValid, differenceInDays } from "date-fns";
import { CounterRead } from "@/types/counter.type";
import { getCurrentPeriod } from "@/utils/counter.utils";

interface CounterCardProps {
  counter: CounterRead;
  onClick?: (counter: CounterRead) => void;
  onEdit?: (counter: CounterRead) => void;
  onDelete?: (counter: CounterRead) => void;
  onRestart?: (counter: CounterRead) => void;
  onComplete?: (counter: CounterRead) => void;
  onShare?: (counter: CounterRead) => void;
}

export default function CounterCard({
  counter,
  onClick,
  onEdit,
  onDelete,
  onRestart,
  onComplete,
  onShare,
}: CounterCardProps) {
  const period = getCurrentPeriod(counter);
  const startDate = period?.started_at ? new Date(period.started_at) : null;
  const endDate = period?.ended_at ? new Date(period.ended_at) : null;

  const days =
    startDate && isValid(startDate)
      ? differenceInDays(
          endDate && isValid(endDate) ? endDate : new Date(),
          startDate,
        )
      : 0;

  const isActive = counter.status === "active";

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
        {/* Title + chips */}
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
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

            <Box sx={{ display: "flex", gap: 0.75, mt: 1, flexWrap: "wrap" }}>
              <Chip
                icon={isActive ? <AccessTime /> : <CheckCircle />}
                label={isActive ? "Active" : "Completed"}
                color={isActive ? "primary" : "success"}
                size="small"
                variant="outlined"
              />
              <Chip
                icon={counter.visibility === "public" ? <Public /> : <Lock />}
                label={counter.visibility === "public" ? "Public" : "Private"}
                color="primary"
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

        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Started
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {startDate && isValid(startDate)
                ? format(startDate, "MMM dd, yyyy")
                : "—"}
            </Typography>
          </Box>

          <Box sx={{ textAlign: "right" }}>
            <Typography variant="caption" color="text.secondary">
              {isActive ? "Duration" : "Lasted"}
            </Typography>
            <Typography
              variant="body2"
              color={isActive ? "primary.main" : "text.primary"}
              sx={{ fontWeight: 700 }}
            >
              {days} {days === 1 ? "day" : "days"}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <CardActions
        sx={{ px: 2, pb: 1.5, pt: 0, justifyContent: "space-between" }}
        onClick={(e) => e.stopPropagation()}
      >
        <Box>
          {isActive && onRestart && (
            <Tooltip title="Restart counter">
              <IconButton
                size="small"
                color="warning"
                onClick={() => onRestart(counter)}
              >
                <Replay fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {isActive && onComplete && (
            <Tooltip title="Mark as completed">
              <IconButton
                size="small"
                color="success"
                onClick={() => onComplete(counter)}
              >
                <Flag fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Box>
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
          {counter.visibility === "public" && (
            <Tooltip title="Copy public link">
              <IconButton
                size="small"
                color="info"
                onClick={() => {
                  const url = `${window.location.origin}/counter/${counter.id}`;
                  navigator.clipboard.writeText(url);
                }}
              >
                <Share fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </CardActions>
    </Card>
  );
}

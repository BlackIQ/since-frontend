"use client";

import {
  Box,
  Typography,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  AccessTime,
  CheckCircle,
  Lock,
  Public,
  Circle,
} from "@mui/icons-material";
import { format, isValid, differenceInDays } from "date-fns";
import { CounterRead } from "@/types/counter.type";
import { getSortedPeriods } from "@/utils/counter.utils";

interface CounterDetailProps {
  counter: CounterRead;
}

export default function CounterDetail({ counter }: CounterDetailProps) {
  const periods = getSortedPeriods(counter);
  const isActive = counter.status === "active";

  return (
    <Box>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: 600,
        }}
      >
        {counter.title}
      </Typography>

      <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
        <Chip
          icon={isActive ? <AccessTime /> : <CheckCircle />}
          label={isActive ? "Active" : "Completed"}
          size="small"
          color={isActive ? "primary" : "success"}
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

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {counter.description || "No description provided."}
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 700 }}>
        Period History
      </Typography>

      {periods.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No periods yet.
        </Typography>
      ) : (
        <List disablePadding>
          {periods.map((period, index) => {
            const start = period.started_at
              ? new Date(period.started_at)
              : null;
            const end = period.ended_at ? new Date(period.ended_at) : null;
            const isOpen = !period.ended_at;
            const days =
              start && isValid(start)
                ? differenceInDays(
                    end && isValid(end) ? end : new Date(),
                    start,
                  )
                : 0;

            return (
              <ListItem
                key={period.id}
                alignItems="flex-start"
                sx={{
                  px: 0,
                  py: 1.5,
                  borderBottom:
                    index < periods.length - 1 ? "1px solid" : "none",
                  borderColor: "divider",
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, mt: 0.5 }}>
                  <Circle
                    sx={{
                      fontSize: 12,
                      color: isOpen ? "primary.main" : "text.disabled",
                    }}
                  />
                </ListItemIcon>

                <ListItemText
                  primary={
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        {isOpen
                          ? "Current period"
                          : `Period #${periods.length - index}`}
                      </Typography>
                      <Typography
                        variant="body2"
                        color={isOpen ? "primary.main" : "text.secondary"}
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        {days} {days === 1 ? "day" : "days"}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {start && isValid(start)
                        ? format(start, "MMM dd, yyyy HH:mm")
                        : "—"}
                      {" → "}
                      {isOpen
                        ? "Ongoing"
                        : end && isValid(end)
                          ? format(end, "MMM dd, yyyy HH:mm")
                          : "—"}
                    </Typography>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      )}
    </Box>
  );
}

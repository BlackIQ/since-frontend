"use client";

import { useState, useEffect, useCallback } from "react";

import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Grid,
  Skeleton,
} from "@mui/material";

import Form from "@/components/form.component";
import Confirm from "@/components/confirm.component";
import CounterCard from "@/components/counter.component";
import CreateCounterCard from "@/components/create.component";

import { useDisclosure } from "@/hooks/disclosure.hook";

import {
  allCounters,
  createCounter,
  updateCounter,
  deleteCounter,
} from "@/api/services/counter.service";

import {
  CounterRead,
  CounterCreate,
  CounterUpdate,
} from "@/types/counter.type";

export default function CounterPage() {
  const [counters, setCounters] = useState<CounterRead[]>([]);
  const [selectedCounter, setSelectedCounter] = useState<CounterRead>();

  const [pendingDeleteCounter, setPendingDeleteCounter] =
    useState<CounterRead | null>(null);

  const [loading, setLoading] = useState(true);

  const { isOpen: dialogOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: confirmOpen,
    onOpen: openConfirm,
    onClose: closeConfirm,
  } = useDisclosure();

  const getData = useCallback(async () => {
    setLoading(true);

    try {
      const data = await allCounters();
      setCounters(data);
    } catch (error) {
      console.error("Failed to fetch counters:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  const handleCreate = () => {
    setSelectedCounter(undefined);
    onOpen();
  };

  const handleEdit = (counter: CounterRead) => {
    setSelectedCounter(counter);
    onOpen();
  };

  const handleDeleteClick = (counter: CounterRead) => {
    setPendingDeleteCounter(counter);
    openConfirm();
  };

  const handleAdd = async (data: CounterCreate) => {
    setLoading(true);

    try {
      await createCounter(data);
      onClose();
      await getData();
    } catch (error) {
      console.error("Failed to create counter:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data: CounterUpdate) => {
    if (!selectedCounter) return;

    setLoading(true);

    try {
      await updateCounter(selectedCounter.id, data);
      onClose();
      await getData();
    } catch (error) {
      console.error("Failed to update counter:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!pendingDeleteCounter) return;

    setLoading(true);

    try {
      await deleteCounter(pendingDeleteCounter.id);

      closeConfirm();
      setPendingDeleteCounter(null);

      await getData();
    } catch (error) {
      console.error("Failed to delete counter:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        py: 2,
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
          }}
        >
          Counters
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Track your progress and keep your goals moving forward.
        </Typography>
      </Box>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <CreateCounterCard onClick={handleCreate} />
        </Grid>

        {loading
          ? Array.from({ length: 5 }).map((_, index) => (
              <Grid key={index} size={{ xs: 12, sm: 6, lg: 4 }}>
                <Skeleton
                  variant="rounded"
                  height={260}
                  sx={{ borderRadius: 2 }}
                />
              </Grid>
            ))
          : counters.map((counter) => (
              <Grid key={counter.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                <CounterCard
                  counter={counter}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              </Grid>
            ))}
      </Grid>

      <Dialog open={dialogOpen} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
            }}
          >
            {selectedCounter ? "Edit Counter" : "Create Counter"}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {selectedCounter
              ? "Update your counter information."
              : "Start tracking something that matters to you."}
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <Form
            name="create_counter"
            callback={selectedCounter ? handleUpdate : handleAdd}
            def={
              selectedCounter
                ? {
                    title: selectedCounter.title,
                    description: selectedCounter.description,
                    started_at: selectedCounter.periods?.[0]?.started_at,
                  }
                : {}
            }
            button={selectedCounter ? "Update Counter" : "Create Counter"}
            btnStyle={{
              disabled: loading,
            }}
          />
        </DialogContent>
      </Dialog>

      <Confirm
        isOpen={confirmOpen}
        onClose={() => {
          closeConfirm();
          setPendingDeleteCounter(null);
        }}
        onConfirm={handleDelete}
        title="Delete Counter"
        message={`Are you sure you want to delete "${pendingDeleteCounter?.title || "this counter"}"? This action cannot be undone.`}
        confirmText="Delete"
        loading={loading}
      />
    </Box>
  );
}

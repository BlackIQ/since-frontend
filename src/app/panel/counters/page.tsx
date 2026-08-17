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
import CounterDetail from "@/components/detail.component";

import { useDisclosure } from "@/hooks/disclosure.hook";

import {
  allCounters,
  createCounter,
  updateCounter,
  deleteCounter,
  restartCounter,
  completeCounter,
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
  const [actionLoading, setActionLoading] = useState(false);

  const [detailCounter, setDetailCounter] = useState<CounterRead | null>(null);
  const {
    isOpen: detailOpen,
    onOpen: openDetail,
    onClose: closeDetail,
  } = useDisclosure();

  const handleCardClick = (counter: CounterRead) => {
    setDetailCounter(counter);
    openDetail();
  };

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
    setActionLoading(true);
    try {
      await createCounter(data);
      onClose();
      await getData();
    } catch (error) {
      console.error("Failed to create counter:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (data: CounterUpdate) => {
    if (!selectedCounter) return;
    setActionLoading(true);
    try {
      await updateCounter(selectedCounter.id, data);
      onClose();
      await getData();
    } catch (error) {
      console.error("Failed to update counter:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!pendingDeleteCounter) return;
    setActionLoading(true);
    try {
      await deleteCounter(pendingDeleteCounter.id);
      closeConfirm();
      setPendingDeleteCounter(null);
      await getData();
    } catch (error) {
      console.error("Failed to delete counter:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRestart = async (counter: CounterRead) => {
    setActionLoading(true);
    try {
      await restartCounter(counter.id);
      await getData();
    } catch (error) {
      console.error("Failed to restart counter:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async (counter: CounterRead) => {
    setActionLoading(true);
    try {
      await completeCounter(counter.id);
      await getData();
    } catch (error) {
      console.error("Failed to complete counter:", error);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", py: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
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
                  onClick={handleCardClick}
                  counter={counter}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                  onRestart={handleRestart}
                  onComplete={handleComplete}
                  onShare={() => {}}
                />
              </Grid>
            ))}
      </Grid>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {selectedCounter ? "Edit Counter" : "Create Counter"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {selectedCounter
              ? "Update your counter information."
              : "Start tracking something that matters to you."}
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          {selectedCounter ? (
            <Form
              name="update_counter"
              callback={handleUpdate}
              def={{
                title: selectedCounter.title,
                description: selectedCounter.description,
                visibility: selectedCounter.visibility,
              }}
              button="Update Counter"
              btnStyle={{ disabled: actionLoading }}
            />
          ) : (
            <Form
              name="create_counter"
              callback={handleAdd}
              button="Create Counter"
              btnStyle={{ disabled: actionLoading }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={detailOpen} onClose={closeDetail} fullWidth maxWidth="sm">
        <DialogTitle>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
            }}
          >
            Counter Details
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          {detailCounter && <CounterDetail counter={detailCounter} />}
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
        loading={actionLoading}
      />
    </Box>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableContainer,
  Paper,
  Box,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  IconButton,
  Typography,
  Button,
  Pagination,
  Skeleton,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { format as dateFormat, isValid } from "date-fns";
import tables, { TableName } from "@/core/table.config";

interface TableProps {
  table: TableName;
  data: any[];
  addText?: string;
  add?: () => void;
  clk?: (row: any) => void;
  del?: (row: any) => void;
  upd?: (row: any) => void;
  page?: number;
  totalPages?: number;
  pageSize?: number;
  onPageChange?: (newPage: number) => void;
  removeItems?: string[];
  addItems?: Record<string, string>;
  details?: string;
  loading?: boolean;
}

export default function TableComponent({
  table,
  data = [],
  addText = "Add New",
  add,
  clk,
  del,
  upd,
  page: serverPage,
  totalPages: serverTotalPages,
  pageSize = 10,
  onPageChange,
  removeItems = [],
  addItems = {},
  details,
  loading = false,
}: TableProps) {
  const baseConfig = tables[table];

  const [internalPage, setInternalPage] = useState<number>(1);

  const config = useMemo(() => {
    if (!baseConfig) {
      return { title: "Table", fields: {} as Record<string, string> };
    }

    const fields: Record<string, string> = { ...baseConfig.fields };

    removeItems.forEach((item) => {
      delete fields[item];
    });

    Object.entries(addItems).forEach(([key, value]) => {
      fields[key] = value;
    });

    return { ...baseConfig, fields };
  }, [baseConfig, removeItems, addItems]);

  const isServerPaginated = Boolean(serverTotalPages && onPageChange);
  const activePage = isServerPaginated ? serverPage || 1 : internalPage;

  const computedTotalPages = isServerPaginated
    ? serverTotalPages || 1
    : Math.ceil(data.length / pageSize) || 1;

  const paginatedData = useMemo(() => {
    if (isServerPaginated) return data;
    const startIndex = (activePage - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  }, [data, isServerPaginated, activePage, pageSize]);

  const handlePageChange = (newPage: number) => {
    if (isServerPaginated && onPageChange) {
      onPageChange(newPage);
    } else {
      setInternalPage(newPage);
    }
  };

  const renderCellContent = (row: any, key: string) => {
    if (key === "update") {
      return upd ? (
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            upd(row);
          }}
          color="primary"
          size="small"
        >
          <Edit fontSize="small" />
        </IconButton>
      ) : null;
    }

    if (key === "delete") {
      return del ? (
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            del(row);
          }}
          color="error"
          size="small"
        >
          <Delete fontSize="small" />
        </IconButton>
      ) : null;
    }

    const value = key.split(".").reduce((acc, prop) => acc?.[prop], row);

    switch (key) {
      case "created_at":
      case "updated_at": {
        if (!value) return "—";
        const dateObj = new Date(value);
        return isValid(dateObj) ? dateFormat(dateObj, "yyyy/MM/dd") : "—";
      }
      default:
        return value !== undefined && value !== null && value !== ""
          ? String(value)
          : "—";
    }
  };

  const fieldKeys = Object.keys(config.fields);

  const centeredFields = [
    "update",
    "delete",
    "agent_availability",
    "is_active",
    "communication",
  ];

  const isCenteredField = (key: string) => centeredFields.includes(key);

  return (
    <Box sx={{ width: "100%", py: 2 }}>
      {/* Header Bar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            color="text.primary"
            sx={{
              fontWeight: 600,
            }}
          >
            {config.title}
          </Typography>
          {details && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {details}
            </Typography>
          )}
        </Box>

        {add && (
          <Button
            onClick={add}
            variant="contained"
            color="primary"
            startIcon={<Add />}
            disableElevation
            sx={{
              px: 3,
              fontWeight: 600,
            }}
          >
            {addText}
          </Button>
        )}
      </Box>

      {/* Table Container */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#F7F5F0" }}>
              {Object.entries(config.fields).map(([key, label]) => (
                <TableCell
                  key={key}
                  align={isCenteredField(key) ? "center" : "left"}
                >
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  {fieldKeys.map((key) => (
                    <TableCell key={key} sx={{ borderColor: "divider", py: 2 }}>
                      <Skeleton variant="text" width="80%" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={fieldKeys.length}
                  sx={{ textAlign: "center", py: 8, borderColor: "divider" }}
                >
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    gutterBottom
                  >
                    No records found
                  </Typography>
                  {add && (
                    <Button
                      onClick={add}
                      variant="contained"
                      color="primary"
                      startIcon={<Add />}
                      disableElevation
                      sx={{
                        px: 3,
                        fontWeight: 600,
                      }}
                    >
                      {addText}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, rowIdx) => (
                <TableRow
                  key={row.id || row._id || rowIdx}
                  hover
                  onClick={() => clk?.(row)}
                  sx={{
                    cursor: clk ? "pointer" : "default",
                    "&:last-child td": { borderBottom: 0 },
                  }}
                >
                  {fieldKeys.map((key) => (
                    <TableCell
                      key={key}
                      align={isCenteredField(key) ? "center" : "left"}
                      sx={{
                        borderColor: "divider",
                        py: 1.75,
                        fontSize: "0.875rem",
                        color: "text.primary",
                      }}
                    >
                      {renderCellContent(row, key)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Bar */}
      {!loading && computedTotalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={computedTotalPages}
            page={activePage}
            onChange={(_, newPage) => handlePageChange(newPage)}
            color="primary"
            shape="rounded"
            size="medium"
          />
        </Box>
      )}
    </Box>
  );
}

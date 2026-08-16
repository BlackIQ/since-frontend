"use client";

import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Grid,
  Chip,
  OutlinedInput,
  FormHelperText,
} from "@mui/material";

import forms, { FormConfig, SelectOption } from "@/core/form.config";

export interface FormProps<T extends Record<string, any>> {
  name: string;
  button?: string;
  btnStyle?: {
    color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
    fullWidth?: boolean;
    disabled?: boolean;
  };
  def?: Partial<T>;
  callback: (data: T) => void;
  selectData?: Record<string, SelectOption[]>;
  disables?: string[];
}

export default function Form<T extends Record<string, any>>({
  name,
  button = "Save",
  btnStyle = {},
  def = {},
  callback,
  selectData = {},
  disables = [],
}: FormProps<T>) {
  const formConfig: FormConfig = forms[name] || {};

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<T>({
    defaultValues: def as any,
  });

  const onSubmit: SubmitHandler<T> = (data) => {
    callback(data);
  };

  const getOptions = (
    fieldName: string,
    field: (typeof formConfig)[string],
  ): SelectOption[] => {
    if (field.optionsKey && selectData[field.optionsKey]) {
      return selectData[field.optionsKey];
    }
    return field.options || selectData[fieldName] || [];
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ width: "100%", py: 1 }}
    >
      <Grid container spacing={2}>
        {Object.entries(formConfig).map(([fieldName, field]) => {
          const isDisabled = disables.includes(fieldName);
          const fieldError = errors[fieldName]?.message as string | undefined;

          return (
            <Grid key={fieldName} size={field.size || { xs: 12 }}>
              {/* TEXT, NUMBER, PASSWORD */}
              {(field.type === "text" ||
                field.type === "number" ||
                field.type === "password") && (
                <TextField
                  fullWidth
                  size="small"
                  label={field.label}
                  placeholder={field.placeholder}
                  type={
                    field.type === "password"
                      ? "password"
                      : field.type === "number"
                        ? "number"
                        : "text"
                  }
                  disabled={isDisabled}
                  error={!!fieldError}
                  helperText={fieldError}
                  {...register(fieldName as any, field.advanced)}
                />
              )}

              {/* TEXTAREA */}
              {field.type === "textarea" && (
                <TextField
                  fullWidth
                  size="small"
                  multiline
                  rows={3}
                  label={field.label}
                  placeholder={field.placeholder}
                  disabled={isDisabled}
                  error={!!fieldError}
                  helperText={fieldError}
                  {...register(fieldName as any, field.advanced)}
                />
              )}

              {/* SWITCH */}
              {field.type === "switch" && (
                <Controller
                  name={fieldName as any}
                  control={control}
                  defaultValue={(def[fieldName] ?? true) as any}
                  render={({ field: { onChange, value } }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={Boolean(value)}
                          onChange={(e) => onChange(e.target.checked)}
                          disabled={isDisabled}
                          color="primary"
                        />
                      }
                      label={field.label}
                      sx={{ color: "text.primary" }}
                    />
                  )}
                />
              )}

              {/* SINGLE SELECT (Binds to ID) */}
              {field.type === "select" && (
                <Controller
                  name={fieldName as any}
                  control={control}
                  rules={field.advanced}
                  defaultValue={(def[fieldName] ?? "") as any}
                  render={({ field: { onChange, value } }) => {
                    const options = getOptions(fieldName, field);
                    return (
                      <FormControl
                        fullWidth
                        size="small"
                        error={!!fieldError}
                        disabled={isDisabled}
                      >
                        <InputLabel id={`${fieldName}-label`}>
                          {field.label}
                        </InputLabel>
                        <Select
                          labelId={`${fieldName}-label`}
                          value={value ?? ""}
                          label={field.label}
                          onChange={(e) => onChange(e.target.value)}
                        >
                          {options.map((opt) => (
                            <MenuItem key={opt.id} value={opt.id}>
                              {opt.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {fieldError && (
                          <FormHelperText>{fieldError}</FormHelperText>
                        )}
                      </FormControl>
                    );
                  }}
                />
              )}

              {/* MULTI SELECT (Binds to Array of IDs: [id1, id2]) */}
              {field.type === "multiselect" && (
                <Controller
                  name={fieldName as any}
                  control={control}
                  rules={field.advanced}
                  defaultValue={(def[fieldName] ?? []) as any}
                  render={({ field: { onChange, value } }) => {
                    const options = getOptions(fieldName, field);
                    const selectedIds: (string | number)[] = Array.isArray(
                      value,
                    )
                      ? value
                      : [];

                    return (
                      <FormControl
                        fullWidth
                        size="small"
                        error={!!fieldError}
                        disabled={isDisabled}
                      >
                        <InputLabel id={`${fieldName}-multi-label`}>
                          {field.label}
                        </InputLabel>
                        <Select
                          labelId={`${fieldName}-multi-label`}
                          multiple
                          value={selectedIds}
                          onChange={(e) => {
                            const val = e.target.value;
                            onChange(
                              typeof val === "string" ? val.split(",") : val,
                            );
                          }}
                          input={<OutlinedInput label={field.label} />}
                          renderValue={(selected) => (
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.5,
                              }}
                            >
                              {(selected as (string | number)[]).map((id) => {
                                const found = options.find((o) => o.id === id);
                                return (
                                  <Chip
                                    key={id}
                                    label={found ? found.label : id}
                                    size="small"
                                    sx={{
                                      height: 24,
                                      fontSize: "0.75rem",
                                      borderRadius: 1,
                                    }}
                                  />
                                );
                              })}
                            </Box>
                          )}
                        >
                          {options.map((opt) => (
                            <MenuItem key={opt.id} value={opt.id}>
                              {opt.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {fieldError && (
                          <FormHelperText>{fieldError}</FormHelperText>
                        )}
                      </FormControl>
                    );
                  }}
                />
              )}
            </Grid>
          );
        })}
      </Grid>

      {button && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button
            variant="contained"
            color={btnStyle.color || "primary"}
            type="submit"
            fullWidth={btnStyle.fullWidth}
            disabled={btnStyle.disabled}
            disableElevation
            sx={{
              px: 3,
              py: 1,
              fontWeight: 600,
            }}
          >
            {button}
          </Button>
        </Box>
      )}
    </Box>
  );
}

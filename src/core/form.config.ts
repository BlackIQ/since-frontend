export type FieldType =
  | "text"
  | "number"
  | "textarea"
  | "password"
  | "select"
  | "multiselect"
  | "switch";

export interface SelectOption {
  id: string | number;
  label: string;
}

export interface FormFieldConfig {
  type: FieldType;
  label: string;
  placeholder?: string;
  size?: { xs?: number; sm?: number; md?: number; lg?: number };
  options?: SelectOption[];
  optionsKey?: string;
  advanced?: {
    required?: boolean | string;
    min?: number;
    max?: number;
    pattern?: RegExp;
  };
}

export type FormConfig = Record<string, FormFieldConfig>;

const forms: Record<string, FormConfig> = {
  login: {
    email: {
      type: "text",
      label: "Email Address",
      placeholder: "name@domain.com",
      size: { xs: 12 },
      advanced: { required: "Email is required" },
    },
    password: {
      type: "password",
      label: "Password",
      placeholder: "Enter password",
      size: { xs: 12 },
      advanced: { required: "Password is required" },
    },
  },

  register: {
    firstName: {
      type: "text",
      label: "First Name",
      placeholder: "John",
      size: { xs: 12, sm: 6 },
      advanced: { required: "First name is required" },
    },
    lastName: {
      type: "text",
      label: "Last Name",
      placeholder: "Doe",
      size: { xs: 12, sm: 6 },
      advanced: { required: "Last name is required" },
    },
    email: {
      type: "text",
      label: "Email Address",
      placeholder: "john@example.com",
      size: { xs: 12 },
      advanced: { required: "Email is required" },
    },
    password: {
      type: "password",
      label: "Password",
      placeholder: "Create strong password",
      size: { xs: 12 },
      advanced: { required: "Password is required" },
    },
  },

  forget: {
    email: {
      type: "text",
      label: "Email Address",
      placeholder: "name@domain.com",
      size: { xs: 12 },
      advanced: { required: "Email is required" },
    },
  },

  reset: {
    new_password: {
      type: "password",
      label: "New Password",
      advanced: { required: true },
    },
    confirm_password: {
      type: "password",
      label: "Confirm New Password",
      advanced: { required: true },
    },
  },

  user_profile: {
    first_name: {
      type: "text",
      label: "First Name",
      advanced: { required: true },
    },
    last_name: {
      type: "text",
      label: "Last Name",
      advanced: { required: true },
    },
  },

  user_password: {
    current_password: {
      type: "password",
      label: "Current Password",
      advanced: { required: true },
    },
    new_password: {
      type: "password",
      label: "New Password",
      advanced: { required: true },
    },
    confirm_password: {
      type: "password",
      label: "Confirm New Password",
      advanced: { required: true },
    },
  },

  user_email: {
    email: {
      type: "text",
      label: "New Email Address",
      advanced: { required: true },
    },
  },
};

export default forms;

export type FieldType =
  | "text"
  | "number"
  | "textarea"
  | "password"
  | "select"
  | "multiselect"
  | "switch"
  | "datepicker";

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
      advanced: {
        required: "Email is required",
      },
    },
    password: {
      type: "password",
      label: "Password",
      placeholder: "Enter your password",
      size: { xs: 12 },
      advanced: {
        required: "Password is required",
      },
    },
  },

  register: {
    username: {
      type: "text",
      label: "Username",
      placeholder: "Choose a username",
      size: { xs: 12 },
      advanced: {
        required: "Username is required",
      },
    },
    display_name: {
      type: "text",
      label: "Display Name",
      placeholder: "How should we call you?",
      size: { xs: 12 },
      advanced: {
        required: "Display name is required",
      },
    },
    email: {
      type: "text",
      label: "Email Address",
      placeholder: "name@domain.com",
      size: { xs: 12 },
      advanced: {
        required: "Email is required",
      },
    },
    first_name: {
      type: "text",
      label: "First Name",
      placeholder: "John",
      size: { xs: 12, sm: 6 },
    },
    last_name: {
      type: "text",
      label: "Last Name",
      placeholder: "Doe",
      size: { xs: 12, sm: 6 },
    },
    password: {
      type: "password",
      label: "Password",
      placeholder: "Create a strong password",
      size: { xs: 12 },
      advanced: {
        required: "Password is required",
      },
    },
  },

  forget: {
    email: {
      type: "text",
      label: "Email Address",
      placeholder: "name@domain.com",
      size: { xs: 12 },
      advanced: {
        required: "Email is required",
      },
    },
  },

  reset: {
    new_password: {
      type: "password",
      label: "New Password",
      placeholder: "Create a new password",
      size: { xs: 12 },
      advanced: {
        required: "New password is required",
      },
    },
    confirm_password: {
      type: "password",
      label: "Confirm New Password",
      placeholder: "Confirm your new password",
      size: { xs: 12 },
      advanced: {
        required: "Please confirm your new password",
      },
    },
  },

  user_profile: {
    username: {
      type: "text",
      label: "Username",
      placeholder: "Username",
      size: { xs: 12 },
      advanced: {
        required: true,
      },
    },
    display_name: {
      type: "text",
      label: "Display Name",
      placeholder: "Display name",
      size: { xs: 12 },
      advanced: {
        required: true,
      },
    },
    first_name: {
      type: "text",
      label: "First Name",
      placeholder: "John",
      size: { xs: 12, sm: 6 },
    },
    last_name: {
      type: "text",
      label: "Last Name",
      placeholder: "Doe",
      size: { xs: 12, sm: 6 },
    },
  },

  user_password: {
    current_password: {
      type: "password",
      label: "Current Password",
      placeholder: "Enter your current password",
      size: { xs: 12 },
      advanced: {
        required: true,
      },
    },
    new_password: {
      type: "password",
      label: "New Password",
      placeholder: "Create a new password",
      size: { xs: 12 },
      advanced: {
        required: true,
      },
    },
    confirm_password: {
      type: "password",
      label: "Confirm New Password",
      placeholder: "Confirm your new password",
      size: { xs: 12 },
      advanced: {
        required: true,
      },
    },
  },

  user_email: {
    email: {
      type: "text",
      label: "New Email Address",
      placeholder: "name@domain.com",
      size: { xs: 12 },
      advanced: {
        required: true,
      },
    },
  },

  create_counter: {
    title: {
      type: "text",
      label: "Title of your counter",
      placeholder: "Stop smoking",
      size: { xs: 12 },
      advanced: {
        required: true,
      },
    },
    description: {
      type: "textarea",
      label: "Your counter description",
      placeholder: "A stopped smoking!",
      size: { xs: 12 },
      advanced: {
        required: true,
      },
    },
    started_at: {
      type: "datepicker",
      label: "Start date",
      size: { xs: 12 },
      advanced: {
        required: true,
      },
    },
  },
};

export default forms;

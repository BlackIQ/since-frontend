import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",

    background: {
      default: "#F7F5F0",
      paper: "#FFFFFF",
    },

    primary: {
      main: "#171717",
      contrastText: "#FFFFFF",
    },

    secondary: {
      main: "#737373",
      contrastText: "#FFFFFF",
    },

    success: {
      main: "#4D7C5F",
      contrastText: "#FFFFFF",
    },

    error: {
      main: "#B85450",
      contrastText: "#FFFFFF",
    },

    text: {
      primary: "#171717",
      secondary: "#737373",
    },

    divider: "#E5E2DC",
  },

  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),

    fontSize: 13,

    h1: {
      fontSize: "1.75rem",
      fontWeight: 600,
    },

    h2: {
      fontSize: "1.5rem",
      fontWeight: 600,
    },

    h3: {
      fontSize: "1.25rem",
      fontWeight: 600,
    },

    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },

  shape: {
    borderRadius: 8,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",

          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },

    MuiPaper: {
      defaultProps: {
        elevation: 0,
        variant: "outlined",
      },

      styleOverrides: {
        root: {
          borderColor: "#E5E2DC",
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #E5E2DC",
          padding: "8px 12px",
        },

        head: {
          fontWeight: 600,
          backgroundColor: "#F7F5F0",
          color: "#737373",
        },
      },
    },
  },
});

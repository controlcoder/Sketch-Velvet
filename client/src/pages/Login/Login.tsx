/**
 * LoginPage.tsx
 * -----------------------------------------------------------------------
 * Authentication screen for "Sketch Velvet" — split layout, dark mode,
 * flat modern UI. Left: canvas-style hero illustration. Right: auth card.
 *
 * Dependencies (install if you don't already have them):
 *   npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
 *
 * Font — add to your index.html:
 *   <link rel="preconnect" href="https://fonts.googleapis.com">
 *   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
 *
 * Usage:
 *   import LoginPage from './LoginPage';
 *   export default function App() {
 *     return <LoginPage />;
 *   }
 * -----------------------------------------------------------------------
 */

import * as React from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Divider,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { keyframes } from "@emotion/react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import TitleIcon from "@mui/icons-material/Title";
import { authApi } from "../../api/auth.api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/* ------------------------------------------------------------------ */
/* Theme — tokens taken directly from spec                             */
/* ------------------------------------------------------------------ */

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#6965DB",
      light: "#8B88F8",
      dark: "#4F46E5",
      contrastText: "#FFFFFF",
    },
    background: { default: "#0F0F11", paper: "#1A1A1F" },
    text: { primary: "#FFFFFF", secondary: "#A1A1AA" },
    divider: "#2C2C35",
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
  },
  shape: { borderRadius: 12 },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            transition: "border-color 200ms ease, box-shadow 200ms ease",
            "& fieldset": { borderColor: "#2C2C35" },
            "&:hover fieldset": { borderColor: "#3A3A45" },
            "&.Mui-focused fieldset": {
              borderColor: "#6965DB",
              borderWidth: 1.5,
            },
            "&.Mui-focused": { boxShadow: "0 0 0 4px rgba(105,101,219,0.15)" },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
          fontWeight: 600,
          transition:
            "transform 200ms ease, filter 200ms ease, background-color 200ms ease",
        },
      },
    },
  },
});

const border = "#2C2C35";
const placeholder = "#6B7280";
const softShadow = "0 20px 50px rgba(0,0,0,0.25)";
const gradient = "linear-gradient(135deg, #6965DB 0%, #4F46E5 100%)";
const dotGrid = "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)";

/* ------------------------------------------------------------------ */
/* Animation keyframes                                                 */
/* ------------------------------------------------------------------ */

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideLeft = keyframes`
  from { opacity: 0; transform: translateX(-32px); }
  to { opacity: 1; transform: translateX(0); }
`;

const staggerFade = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* ------------------------------------------------------------------ */
/* Left section — hero illustration                                    */
/* ------------------------------------------------------------------ */

const features = [
  "Infinite Canvas",
  "Smart Editing",
  "Cloud Sync",
  "Real-time Collaboration (Coming Soon)",
];

const CanvasIllustration = () => (
  <Box
    sx={{
      position: "relative",
      width: "100%",
      maxWidth: 460,
      height: 320,
      borderRadius: "20px",
      border: `1px solid ${border}`,
      bgcolor: "#131316",
      backgroundImage: dotGrid,
      backgroundSize: "20px 20px",
      overflow: "hidden",
      boxShadow: softShadow,
      animation: `${slideLeft} 700ms ease 200ms both`,
    }}
  >
    {/* ambient glow */}
    <Box
      sx={{
        position: "absolute",
        top: -80,
        right: -60,
        width: 260,
        height: 260,
        borderRadius: "50%",
        background:
          "radial-gradient(closest-side, rgba(105,101,219,0.35), transparent)",
        filter: "blur(20px)",
      }}
    />

    {/* rectangle */}
    <Box
      sx={{
        position: "absolute",
        top: "20%",
        left: "10%",
        width: 110,
        height: 72,
        borderRadius: "10px",
        border: "2px solid #6965DB",
        bgcolor: "rgba(105,101,219,0.08)",
        display: "grid",
        placeItems: "center",
      }}
    >
      <CropSquareIcon sx={{ fontSize: 16, color: "#6965DB", opacity: 0.6 }} />
    </Box>

    {/* circle */}
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "40%",
        width: 84,
        height: 84,
        borderRadius: "50%",
        border: "2px solid #8B88F8",
        bgcolor: "rgba(139,136,248,0.08)",
        display: "grid",
        placeItems: "center",
      }}
    >
      <RadioButtonUncheckedIcon
        sx={{ fontSize: 14, color: "#8B88F8", opacity: 0.6 }}
      />
    </Box>

    {/* text block */}
    <Box
      sx={{
        position: "absolute",
        top: "18%",
        left: "62%",
        width: 100,
        height: 46,
        borderRadius: "8px",
        border: `1.5px dashed ${placeholder}`,
        display: "grid",
        placeItems: "center",
      }}
    >
      <TitleIcon sx={{ fontSize: 15, color: placeholder }} />
    </Box>

    {/* arrow */}
    <NorthEastIcon
      sx={{
        position: "absolute",
        top: "58%",
        left: "68%",
        fontSize: 30,
        color: "#4F46E5",
        opacity: 0.85,
      }}
    />

    {/* selection box — marquee */}
    <Box
      sx={{
        position: "absolute",
        top: "38%",
        left: "32%",
        width: 150,
        height: 96,
        border: "1.5px dashed #6965DB",
        borderRadius: "6px",
      }}
    >
      {[
        { top: -4, left: -4 },
        { top: -4, right: -4 },
        { bottom: -4, left: -4 },
        { bottom: -4, right: -4 },
      ].map((pos, i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            ...pos,
            width: 6,
            height: 6,
            bgcolor: "#6965DB",
            borderRadius: "2px",
          }}
        />
      ))}
    </Box>
  </Box>
);

const HeroSection = () => (
  <Stack
    sx={{
      height: "100%",
      px: { sm: 4, md: 6, lg: 8 },
      py: 6,
      position: "relative",
      overflow: "hidden",
    }}
  >
    {/* background decoration */}
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        backgroundImage: dotGrid,
        backgroundSize: "26px 26px",
        maskImage: "radial-gradient(circle at 30% 30%, black, transparent 75%)",
        opacity: 0.5,
      }}
    />
    <Box
      sx={{
        position: "absolute",
        top: "10%",
        left: "-10%",
        width: 380,
        height: 380,
        borderRadius: "50%",
        background:
          "radial-gradient(closest-side, rgba(105,101,219,0.18), transparent)",
        filter: "blur(40px)",
      }}
    />

    <Box
      sx={{
        position: "relative",
        zIndex: 1,
        animation: `${fadeIn} 600ms ease both`,
      }}
    >
      <Stack direction="row" spacing={1.2} sx={{ mb: 5 }}>
        <Box
          sx={{
            width: 30,
            height: 30,
            borderRadius: "8px",
            background: gradient,
            display: "grid",
            placeItems: "center",
          }}
        >
          <Box
            sx={{
              width: 12,
              height: 12,
              border: "1.5px dashed rgba(255,255,255,0.9)",
              borderRadius: "3px",
            }}
          />
        </Box>
        <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
          Sketch Velvet
        </Typography>
      </Stack>

      <Typography
        sx={{
          fontWeight: 700,
          fontSize: { sm: 34, md: 42 },
          letterSpacing: "-0.02em",
          mb: 2,
          maxWidth: 420,
        }}
      >
        Bring Ideas to Life.
      </Typography>
      <Typography
        sx={{ color: "text.secondary", fontSize: 16, mb: 5, maxWidth: 380 }}
      >
        The infinite canvas where sketches turn into shipped work.
      </Typography>

      <Stack spacing={1.6} sx={{ mb: 6 }}>
        {features.map((f, i) => (
          <Stack
            key={f}
            direction="row"
            spacing={1.2}
            sx={{
              animation: `${staggerFade} 500ms ease ${300 + i * 120}ms both`,
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 18, color: "primary.main" }} />
            <Typography sx={{ fontSize: 14.5, color: "text.secondary" }}>
              {f}
            </Typography>
          </Stack>
        ))}
      </Stack>

      <CanvasIllustration />
    </Box>
  </Stack>
);

/* ------------------------------------------------------------------ */
/* Google icon (inline, brand-standard colors, minimal mark)           */
/* ------------------------------------------------------------------ */

const GoogleIcon = () => (
  <Box component="svg" viewBox="0 0 18 18" sx={{ width: 18, height: 18 }}>
    <path
      fill="#4285F4"
      d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z"
    />
    <path
      fill="#34A853"
      d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.98v2.33A9 9 0 0 0 9 18z"
    />
    <path
      fill="#FBBC05"
      d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.98A9 9 0 0 0 0 9c0 1.45.35 2.83.98 4.03l2.97-2.33z"
    />
    <path
      fill="#EA4335"
      d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .98 4.97l2.97 2.33C4.66 5.17 6.65 3.58 9 3.58z"
    />
  </Box>
);

/* ------------------------------------------------------------------ */
/* Right section — authentication card                                 */
/* ------------------------------------------------------------------ */

const AuthCard = () => {
  const navigate = useNavigate();

  const { setUser } = useAuth();

  const [showPassword, setShowPassword] = React.useState(false);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await authApi.login({ email, password });
      if (data.success) {
        setUser(data.user);
        navigate("/dashboard");
      }
    } catch (err) {
      // console.error(err);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 400,
        p: { xs: 3.5, sm: 4.5 },
        borderRadius: "20px",
        border: `1px solid ${border}`,
        bgcolor: "background.paper",
        boxShadow: softShadow,
        animation: `${slideUp} 600ms ease 150ms both`,
      }}
    >
      {/* small logo */}
      <Stack
        direction="row"
        spacing={1}
        sx={{ mb: 4, display: { sm: "none" } }}
      >
        <Box
          sx={{
            width: 26,
            height: 26,
            borderRadius: "7px",
            background: gradient,
            display: "grid",
            placeItems: "center",
          }}
        >
          <Box
            sx={{
              width: 10,
              height: 10,
              border: "1.5px dashed rgba(255,255,255,0.9)",
              borderRadius: "2px",
            }}
          />
        </Box>
        <Typography sx={{ fontWeight: 700, fontSize: 15 }}>
          Sketch Velvet
        </Typography>
      </Stack>

      <Typography sx={{ fontWeight: 700, fontSize: 26, mb: 1 }}>
        Welcome Back
      </Typography>
      <Typography sx={{ color: "text.secondary", fontSize: 14.5, mb: 4 }}>
        Sign in to continue to Sketch Velvet.
      </Typography>

      <Stack component="form" spacing={2.5} noValidate onSubmit={handleSubmit}>
        <TextField
          id="email"
          name="email"
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          fullWidth
          autoComplete="email"
          slotProps={{ inputLabel: { color: "text.secondary" } }}
        />

        <TextField
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label="Password"
          placeholder="Enter your password"
          fullWidth
          autoComplete="current-password"
          slotProps={{
            inputLabel: {
              sx: {
                color: "text.secondary",
              },
            },
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword((v) => !v)}
                    edge="end"
                    size="small"
                    sx={{ color: "text.secondary" }}
                  >
                    {showPassword ? (
                      <VisibilityOffIcon fontSize="small" />
                    ) : (
                      <VisibilityIcon fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <Stack direction="row">
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                sx={{
                  color: border,
                  "&.Mui-checked": { color: "primary.main" },
                }}
              />
            }
            label={
              <Typography sx={{ fontSize: 13.5, color: "text.secondary" }}>
                Remember me
              </Typography>
            }
          />
          <Typography
            component="a"
            href="#"
            sx={{
              fontSize: 13.5,
              color: "primary.light",
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Forgot password?
          </Typography>
        </Stack>

        <Button
          type="submit"
          fullWidth
          size="large"
          disableElevation
          sx={{
            background: gradient,
            color: "#fff",
            py: 1.4,
            fontSize: 15.5,
            "&:hover": {
              background: gradient,
              filter: "brightness(1.1)",
              transform: "translateY(-1px)",
            },
          }}
        >
          Login
        </Button>

        <Stack direction="row" spacing={1.5}>
          <Divider sx={{ flex: 1, borderColor: border }} />
          <Typography sx={{ fontSize: 12.5, color: placeholder }}>
            OR
          </Typography>
          <Divider sx={{ flex: 1, borderColor: border }} />
        </Stack>

        <Button
          fullWidth
          size="large"
          variant="outlined"
          startIcon={<GoogleIcon />}
          sx={{
            py: 1.3,
            fontSize: 14.5,
            borderColor: border,
            color: "text.primary",
            "&:hover": {
              borderColor: "#3A3A45",
              bgcolor: "rgba(255,255,255,0.03)",
              transform: "translateY(-1px)",
            },
          }}
        >
          Continue with Google
        </Button>
      </Stack>

      <Typography
        sx={{
          textAlign: "center",
          fontSize: 13.5,
          color: "text.secondary",
          mt: 4,
        }}
      >
        Don&rsquo;t have an account?{" "}
        <Typography
          component="a"
          href="#"
          sx={{
            color: "primary.light",
            textDecoration: "none",
            fontWeight: 600,
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Sign Up
        </Typography>
      </Typography>
    </Box>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

const LoginPage = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "35% 65%",
          md: "35% 65%",
          lg: "50% 50%",
        },
      }}
    >
      {/* left — hidden on mobile */}
      <Box sx={{ display: { xs: "none", sm: "block" } }}>
        <HeroSection />
      </Box>

      {/* right — always visible, centered */}
      <Stack sx={{ px: 3, py: 6 }}>
        <AuthCard />
      </Stack>
    </Box>
  </ThemeProvider>
);

export default LoginPage;

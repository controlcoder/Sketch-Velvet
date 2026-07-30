/**
 * Signup.tsx
 * -----------------------------------------------------------------------
 * Account creation screen for "Sketch Velvet" — split layout, dark mode.
 * Where Login says "Welcome Back," this screen says "Start Creating" —
 * benefit-led copy, a livelier whiteboard illustration, and a form that
 * gives real-time feedback (password strength, match validation).
 *
 * Dependencies (install if you don't already have them):
 *   npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
 *
 * Font — add to your index.html:
 *   <link rel="preconnect" href="https://fonts.googleapis.com">
 *   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
 *
 * Usage:
 *   import Signup from './Signup';
 *   export default function App() {
 *     return <Signup />;
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
  // Checkbox,
  // FormControlLabel,
  // Divider,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { keyframes } from "@emotion/react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import { authApi } from "../../api/auth.api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

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
    success: { main: "#22C55E" },
    error: { main: "#EF4444" },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
          fontWeight: 600,
          transition:
            "transform 200ms ease, filter 200ms ease, box-shadow 200ms ease",
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

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`;

/* ------------------------------------------------------------------ */
/* Shared input styling — supports focus / success / error states      */
/* ------------------------------------------------------------------ */

type FieldState = "default" | "success" | "error";

const fieldSx = (state: FieldState = "default") => {
  const stateColor =
    state === "success" ? "#22C55E" : state === "error" ? "#EF4444" : border;
  const focusGlow =
    state === "success"
      ? "rgba(34,197,94,0.15)"
      : state === "error"
        ? "rgba(239,68,68,0.15)"
        : "rgba(105,101,219,0.15)";
  const focusColor =
    state === "success" ? "#22C55E" : state === "error" ? "#EF4444" : "#6965DB";

  return {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      transition: "border-color 200ms ease, box-shadow 200ms ease",
      "& fieldset": { borderColor: stateColor },
      "&:hover fieldset": {
        borderColor: state === "default" ? "#3A3A45" : stateColor,
      },
      "&.Mui-focused fieldset": { borderColor: focusColor, borderWidth: 1.5 },
      "&.Mui-focused": { boxShadow: `0 0 0 4px ${focusGlow}` },
    },
  };
};

/* ------------------------------------------------------------------ */
/* Left section — whiteboard-style product showcase                    */
/* ------------------------------------------------------------------ */

const benefits = [
  "Unlimited Boards",
  "Secure Cloud Storage",
  "Fast & Intuitive Drawing",
  "Real-time Collaboration (Coming Soon)",
];

const WhiteboardIllustration = () => (
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
        top: -70,
        left: -50,
        width: 240,
        height: 240,
        borderRadius: "50%",
        background:
          "radial-gradient(closest-side, rgba(105,101,219,0.35), transparent)",
        filter: "blur(20px)",
      }}
    />

    {/* flowchart: two boxes connected by an arrow */}
    <Box
      sx={{
        position: "absolute",
        top: "16%",
        left: "8%",
        width: 92,
        height: 54,
        borderRadius: "10px",
        border: "2px solid #6965DB",
        bgcolor: "rgba(105,101,219,0.08)",
        animation: `${float} 5s ease-in-out infinite`,
      }}
    />
    <NorthEastIcon
      sx={{
        position: "absolute",
        top: "20%",
        left: "30%",
        fontSize: 22,
        color: "#8B88F8",
        transform: "rotate(20deg)",
      }}
    />
    <Box
      sx={{
        position: "absolute",
        top: "12%",
        left: "38%",
        width: 92,
        height: 54,
        borderRadius: "10px",
        border: "2px solid #8B88F8",
        bgcolor: "rgba(139,136,248,0.08)",
        animation: `${float} 5.5s ease-in-out infinite 0.4s`,
      }}
    />

    {/* circle */}
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "10%",
        width: 76,
        height: 76,
        borderRadius: "50%",
        border: "2px solid #4F46E5",
        bgcolor: "rgba(79,70,229,0.08)",
        animation: `${float} 6s ease-in-out infinite 0.2s`,
      }}
    />

    {/* sticky notes */}
    {[
      { top: "58%", left: "64%", rotate: "-6deg", color: "#F5D76E" },
      { top: "68%", left: "78%", rotate: "5deg", color: "#8B88F8" },
    ].map((s, i) => (
      <Box
        key={i}
        sx={{
          position: "absolute",
          top: s.top,
          left: s.left,
          width: 54,
          height: 54,
          bgcolor: s.color,
          opacity: 0.85,
          borderRadius: "4px",
          transform: `rotate(${s.rotate})`,
          boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
        }}
      />
    ))}

    {/* selection handles around the flowchart pair */}
    <Box
      sx={{
        position: "absolute",
        top: "8%",
        left: "6%",
        width: 220,
        height: 100,
        border: "1.5px dashed #6965DB",
        borderRadius: "8px",
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
            width: 7,
            height: 7,
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
        bottom: "5%",
        left: "-8%",
        width: 380,
        height: 380,
        borderRadius: "50%",
        background:
          "radial-gradient(closest-side, rgba(79,70,229,0.2), transparent)",
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
        Start Creating Today.
      </Typography>
      <Typography
        sx={{ color: "text.secondary", fontSize: 16, mb: 5, maxWidth: 400 }}
      >
        Join thousands of creators who sketch ideas, collaborate with teammates,
        and turn concepts into reality.
      </Typography>

      <Stack spacing={1.6} sx={{ mb: 6 }}>
        {benefits.map((b, i) => (
          <Stack
            key={b}
            direction="row"
            spacing={1.2}
            sx={{
              animation: `${staggerFade} 500ms ease ${300 + i * 120}ms both`,
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 18, color: "primary.main" }} />
            <Typography sx={{ fontSize: 14.5, color: "text.secondary" }}>
              {b}
            </Typography>
          </Stack>
        ))}
      </Stack>

      <WhiteboardIllustration />
    </Box>
  </Stack>
);

/* ------------------------------------------------------------------ */
/* Google icon (inline)                                                */
/* ------------------------------------------------------------------ */

// const GoogleIcon = () => (
//   <Box component="svg" viewBox="0 0 18 18" sx={{ width: 18, height: 18 }}>
//     <path
//       fill="#4285F4"
//       d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z"
//     />
//     <path
//       fill="#34A853"
//       d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.98v2.33A9 9 0 0 0 9 18z"
//     />
//     <path
//       fill="#FBBC05"
//       d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.98A9 9 0 0 0 0 9c0 1.45.35 2.83.98 4.03l2.97-2.33z"
//     />
//     <path
//       fill="#EA4335"
//       d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .98 4.97l2.97 2.33C4.66 5.17 6.65 3.58 9 3.58z"
//     />
//   </Box>
// );

/* ------------------------------------------------------------------ */
/* Password strength                                                   */
/* ------------------------------------------------------------------ */

type Strength = "weak" | "medium" | "strong" | null;

function getStrength(pw: string): Strength {
  if (!pw) return null;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (pw.length < 6) return "weak";
  if (score <= 1) return "weak";
  if (score <= 2) return "medium";
  return "strong";
}

const strengthMeta: Record<
  Exclude<Strength, null>,
  { label: string; color: string; bars: number }
> = {
  weak: { label: "Weak", color: "#EF4444", bars: 1 },
  medium: { label: "Medium", color: "#F5A524", bars: 2 },
  strong: { label: "Strong", color: "#22C55E", bars: 3 },
};

const StrengthMeter = ({ strength }: { strength: Strength }) => {
  if (!strength) return null;
  const meta = strengthMeta[strength];
  return (
    <Stack spacing={0.7} sx={{ mt: 1 }}>
      <Stack direction="row" spacing={0.6}>
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              bgcolor: i < meta.bars ? meta.color : border,
              transition: "background-color 200ms ease",
            }}
          />
        ))}
      </Stack>
      <Typography sx={{ fontSize: 12, color: meta.color, fontWeight: 500 }}>
        {meta.label} password
      </Typography>
    </Stack>
  );
};

/* ------------------------------------------------------------------ */
/* Right section — signup card                                         */
/* ------------------------------------------------------------------ */

const SignupCard = () => {
  const navigate = useNavigate();

  const { setUser } = useAuth();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  // const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  // const [showConfirm, setShowConfirm] = React.useState(false);
  // const [agreed, setAgreed] = React.useState(false);
  const [touched, setTouched] = React.useState<{ [k: string]: boolean }>({});
  // const [submitted, setSubmitted] = React.useState(false);

  const strength = getStrength(password);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  // const confirmMatches =
  //   confirmPassword.length > 0 && confirmPassword === password;
  // const confirmMismatch =
  //   confirmPassword.length > 0 && confirmPassword !== password;

  const emailState: FieldState = touched.email
    ? email.length === 0
      ? "error"
      : emailValid
        ? "success"
        : "error"
    : "default";
  // const confirmState: FieldState = touched.confirm
  //   ? confirmMismatch
  //     ? "error"
  //     : confirmMatches
  //       ? "success"
  //       : "default"
  //   : "default";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // setSubmitted(true);
    setTouched({ name: true, email: true, password: true, confirm: true });
    const { data } = await authApi.signup({ name, email, password });
    console.log(data);
    if (data.success) {
      setUser(data.user);
      navigate("/dashboard");
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
        Create Your Account
      </Typography>
      <Typography sx={{ color: "text.secondary", fontSize: 14.5, mb: 4 }}>
        Start sketching in less than a minute.
      </Typography>

      <Stack component="form" spacing={2.4} noValidate onSubmit={handleSubmit}>
        <Box sx={{ animation: `${staggerFade} 450ms ease 100ms both` }}>
          <TextField
            id="name"
            name="name"
            label="Full Name"
            placeholder="Ritik Kumar"
            fullWidth
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            slotProps={{
              inputLabel: {
                sx: {
                  color: "text.secondary",
                },
              },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon
                      sx={{ fontSize: 19, color: placeholder }}
                    />
                  </InputAdornment>
                ),
              },
            }}
            sx={fieldSx()}
          />
        </Box>

        <Box sx={{ animation: `${staggerFade} 450ms ease 200ms both` }}>
          <TextField
            id="email"
            name="email"
            type="email"
            label="Email Address"
            placeholder="you@example.com"
            fullWidth
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            error={emailState === "error"}
            helperText={
              emailState === "error" ? "Enter a valid email address" : " "
            }
            slotProps={{
              inputLabel: {
                sx: {
                  color: "text.secondary",
                },
              },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineIcon
                      sx={{ fontSize: 19, color: placeholder }}
                    />
                  </InputAdornment>
                ),
              },
              formHelperText: {
                sx: {
                  fontSize: 12,
                  ml: 0.2,
                },
              },
            }}
            sx={fieldSx(emailState)}
          />
        </Box>

        <Box sx={{ animation: `${staggerFade} 450ms ease 300ms both` }}>
          <TextField
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            label="Password"
            placeholder="Create a password"
            fullWidth
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            slotProps={{
              inputLabel: {
                sx: {
                  color: "text.secondary",
                },
              },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon
                      sx={{ fontSize: 19, color: placeholder }}
                    />
                  </InputAdornment>
                ),
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
            sx={fieldSx()}
          />
          <StrengthMeter strength={strength} />
        </Box>

        {/* <Box sx={{ animation: `${staggerFade} 450ms ease 400ms both` }}>
          <TextField
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirm ? "text" : "password"}
            label="Confirm Password"
            placeholder="Re-enter your password"
            fullWidth
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
            error={confirmState === "error"}
            helperText={
              confirmState === "error" ? "Passwords don't match" : " "
            }
            FormHelperTextProps={{ sx: { fontSize: 12, ml: 0.2 } }}
            InputLabelProps={{ sx: { color: "text.secondary" } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon sx={{ fontSize: 19, color: placeholder }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                    onClick={() => setShowConfirm((v) => !v)}
                    edge="end"
                    size="small"
                    sx={{ color: "text.secondary" }}
                  >
                    {showConfirm ? (
                      <VisibilityOffIcon fontSize="small" />
                    ) : (
                      <VisibilityIcon fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={fieldSx(confirmState)}
          />
        </Box> */}

        {/* <Box sx={{ animation: `${staggerFade} 450ms ease 500ms both` }}>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                sx={{
                  color: border,
                  "&.Mui-checked": { color: "primary.main" },
                }}
              />
            }
            label={
              <Typography sx={{ fontSize: 13.5, color: "text.secondary" }}>
                I agree to the{" "}
                <Typography
                  component="a"
                  href="#"
                  sx={{
                    color: "primary.light",
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Terms
                </Typography>{" "}
                &amp;{" "}
                <Typography
                  component="a"
                  href="#"
                  sx={{
                    color: "primary.light",
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Privacy Policy
                </Typography>
              </Typography>
            }
          />
          {submitted && !agreed && (
            <Typography
              role="alert"
              sx={{ fontSize: 12, color: "#EF4444", mt: 0.5, ml: 0.5 }}
            >
              Please accept the Terms &amp; Privacy Policy to continue
            </Typography>
          )}
        </Box> */}

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
            animation: `${staggerFade} 450ms ease 600ms both`,
            "&:hover": {
              background: gradient,
              filter: "brightness(1.1)",
              transform: "translateY(-1px)",
              boxShadow: "0 12px 28px rgba(105,101,219,0.35)",
            },
          }}
        >
          Create Account
        </Button>

        {/* <Stack direction="row" spacing={1.5}>
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
        </Button> */}
      </Stack>

      <Typography
        sx={{
          textAlign: "center",
          fontSize: 13.5,
          color: "text.secondary",
          mt: 4,
        }}
      >
        Already have an account?{" "}
        <Typography
          component="a"
          onClick={() => navigate("/login")}
          sx={{
            color: "primary.light",
            textDecoration: "none",
            fontWeight: 600,
            "&:hover": { textDecoration: "underline", cursor: "pointer" },
          }}
        >
          Login
        </Typography>
      </Typography>
    </Box>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

const Signup = () => (
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
      <Box sx={{ display: { xs: "none", sm: "block" } }}>
        <HeroSection />
      </Box>

      <Stack sx={{ px: 3, py: 6 }}>
        <SignupCard />
      </Stack>
    </Box>
  </ThemeProvider>
);

export default Signup;

/**
 * LandingPage.tsx
 * -----------------------------------------------------------------------
 * Marketing landing page for "Marq" — an infinite collaborative canvas.
 *
 * Dependencies (install if you don't already have them):
 *   npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
 *
 * Font:
 *   This design uses Inter for UI/copy and JetBrains Mono for small
 *   technical accents (zoom %, coordinates, tech-stack badges) — a nod
 *   to the coordinate readouts you'd see in an actual canvas app.
 *   Add both to your index.html, e.g.:
 *
 *   <link rel="preconnect" href="https://fonts.googleapis.com">
 *   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
 *
 * Usage:
 *   import LandingPage from './LandingPage';
 *   export default function App() {
 *     return <LandingPage />;
 *   }
 * -----------------------------------------------------------------------
 */

import * as React from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Container,
  Stack,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Chip,
  Divider,
  IconButton,
} from "@mui/material";
import GestureIcon from "@mui/icons-material/Gesture";
import GroupsIcon from "@mui/icons-material/Groups";
import CategoryIcon from "@mui/icons-material/Category";
import HistoryIcon from "@mui/icons-material/History";
import IosShareIcon from "@mui/icons-material/IosShare";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";
import { Link } from "react-router-dom";

/* ------------------------------------------------------------------ */
/* Theme                                                               */
/* ------------------------------------------------------------------ */

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#6965DB",
      light: "#8B87E8",
      dark: "#524ECC",
      contrastText: "#FFFFFF",
    },
    background: { default: "#0A0A0F", paper: "#131319" },
    text: { primary: "#F4F4F7", secondary: "#9C9AB5" },
    divider: "rgba(255,255,255,0.08)",
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: { fontWeight: 800, letterSpacing: "-0.03em" },
    h2: { fontWeight: 700, letterSpacing: "-0.02em" },
    h3: { fontWeight: 700, letterSpacing: "-0.02em" },
    h4: { fontWeight: 600, letterSpacing: "-0.01em" },
    button: { fontWeight: 600, textTransform: "none" },
  },
  shape: { borderRadius: 10 },
});

const mono = '"JetBrains Mono", "SFMono-Regular", Menlo, monospace';
const gradient = "linear-gradient(135deg, #6965DB 0%, #8B5CF6 100%)";
const dotGrid = "radial-gradient(rgba(255,255,255,0.09) 1px, transparent 1px)";

/* ------------------------------------------------------------------ */
/* Small helpers                                                       */
/* ------------------------------------------------------------------ */

const SectionEyebrow = ({ children }: { children: React.ReactNode }) => (
  <Typography
    sx={{
      fontFamily: mono,
      fontSize: 13,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "primary.light",
      mb: 1.5,
    }}
  >
    {children}
  </Typography>
);

/* ------------------------------------------------------------------ */
/* Navbar                                                              */
/* ------------------------------------------------------------------ */

const Navbar = () => (
  <AppBar
    position="sticky"
    elevation={0}
    sx={{
      bgcolor: "rgba(10,10,15,0.75)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid",
      borderColor: "divider",
    }}
  >
    <Container maxWidth="lg">
      <Toolbar disableGutters sx={{ py: 1.5, justifyContent: "space-between" }}>
        <Stack direction="row" spacing={1.2}>
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
          <Typography
            sx={{ fontWeight: 800, fontSize: 19, letterSpacing: "-0.02em" }}
          >
            Marq
          </Typography>
        </Stack>

        <Stack
          direction="row"
          spacing={4}
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          {["Features", "How it works", "Stack"].map((label) => (
            <Typography
              key={label}
              component="a"
              href={`#${label.toLowerCase().replace(/\s/g, "-")}`}
              sx={{
                fontSize: 14.5,
                fontWeight: 500,
                color: "text.secondary",
                textDecoration: "none",
                "&:hover": { color: "text.primary" },
              }}
            >
              {label}
            </Typography>
          ))}
        </Stack>

        <Stack direction="row" spacing={1.5}>
          <Button
            component={Link}
            to="/login"
            variant="text"
            sx={{
              color: "text.secondary",
              textTransform: "none",
              "&:hover": {
                color: "text.primary",
                bgcolor: "transparent",
              },
            }}
          >
            Log in
          </Button>

          <Button
            component={Link}
            to="/signup"
            variant="contained"
            disableElevation
            sx={{
              background: gradient,
              px: 2.5,
              borderRadius: "8px",
              textTransform: "none",
              "&:hover": {
                background: gradient,
                filter: "brightness(1.08)",
              },
            }}
          >
            Sign up
          </Button>
        </Stack>
      </Toolbar>
    </Container>
  </AppBar>
);

/* ------------------------------------------------------------------ */
/* Hero — canvas mockup is the signature element                       */
/* ------------------------------------------------------------------ */

const cursors = [
  { name: "A", color: "#6965DB", top: "18%", left: "58%" },
  { name: "R", color: "#34D399", top: "62%", left: "74%" },
  { name: "K", color: "#F472B6", top: "40%", left: "22%" },
];

const CanvasMockup = () => (
  <Box
    sx={{
      position: "relative",
      width: "100%",
      height: { xs: 320, md: 440 },
      borderRadius: "16px",
      border: "1px solid",
      borderColor: "divider",
      bgcolor: "#0D0D13",
      backgroundImage: dotGrid,
      backgroundSize: "22px 22px",
      overflow: "hidden",
      boxShadow: "0 30px 80px -20px rgba(105,101,219,0.35)",
    }}
  >
    {/* window chrome */}
    <Stack
      direction="row"
      spacing={0.8}
      sx={{ position: "absolute", top: 16, left: 16, zIndex: 3 }}
    >
      {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
        <Box
          key={c}
          sx={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            bgcolor: c,
            opacity: 0.85,
          }}
        />
      ))}
    </Stack>

    {/* zoom readout, mono accent */}
    <Typography
      sx={{
        position: "absolute",
        top: 14,
        right: 18,
        fontFamily: mono,
        fontSize: 12,
        color: "text.secondary",
        zIndex: 3,
      }}
    >
      126%
    </Typography>

    {/* a couple of drawn shapes */}
    <Box
      sx={{
        position: "absolute",
        top: "30%",
        left: "12%",
        width: 120,
        height: 78,
        borderRadius: "10px",
        border: "2px solid #6965DB",
        bgcolor: "rgba(105,101,219,0.08)",
      }}
    />
    <Box
      sx={{
        position: "absolute",
        top: "52%",
        left: "46%",
        width: 96,
        height: 96,
        borderRadius: "50%",
        border: "2px solid #34D399",
        bgcolor: "rgba(52,211,153,0.08)",
      }}
    />
    <Box
      sx={{
        position: "absolute",
        top: "20%",
        left: "60%",
        width: 130,
        height: 60,
        borderRadius: "8px",
        border: "2px solid #F472B6",
        bgcolor: "rgba(244,114,182,0.08)",
        transform: "rotate(-4deg)",
      }}
    />

    {/* marquee selection box — the signature motif */}
    <Box
      sx={{
        position: "absolute",
        top: "46%",
        left: "40%",
        width: 210,
        height: 130,
        border: "1.5px dashed #6965DB",
        borderRadius: "6px",
        zIndex: 2,
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

    {/* collaborator cursors */}
    {cursors.map((c) => (
      <Box
        key={c.name}
        sx={{ position: "absolute", top: c.top, left: c.left, zIndex: 4 }}
      >
        <NorthEastIcon
          sx={{ fontSize: 18, color: c.color, transform: "rotate(-90deg)" }}
        />
        <Box
          sx={{
            mt: 0.3,
            px: 0.9,
            py: 0.1,
            borderRadius: "6px",
            bgcolor: c.color,
            fontSize: 11,
            fontFamily: mono,
            color: "#0A0A0F",
            fontWeight: 600,
            display: "inline-block",
          }}
        >
          {c.name}
        </Box>
      </Box>
    ))}

    {/* floating toolbar */}
    <Stack
      direction="row"
      spacing={1.2}
      sx={{
        position: "absolute",
        bottom: 18,
        left: "50%",
        transform: "translateX(-50%)",
        px: 1.5,
        py: 1,
        borderRadius: "12px",
        bgcolor: "rgba(19,19,25,0.9)",
        border: "1px solid",
        borderColor: "divider",
        backdropFilter: "blur(6px)",
      }}
    >
      {[GestureIcon, CategoryIcon, HistoryIcon].map((Icon, i) => (
        <Box
          key={i}
          sx={{
            width: 30,
            height: 30,
            borderRadius: "8px",
            display: "grid",
            placeItems: "center",
            bgcolor: i === 0 ? "primary.main" : "transparent",
          }}
        >
          <Icon
            sx={{ fontSize: 16, color: i === 0 ? "#fff" : "text.secondary" }}
          />
        </Box>
      ))}
    </Stack>
  </Box>
);

const Hero = () => (
  <Box
    sx={{
      position: "relative",
      pt: { xs: 10, md: 14 },
      pb: { xs: 8, md: 12 },
      overflow: "hidden",
    }}
  >
    {/* ambient gradient glow */}
    <Box
      sx={{
        position: "absolute",
        top: -200,
        left: "50%",
        transform: "translateX(-50%)",
        width: 900,
        height: 500,
        background:
          "radial-gradient(closest-side, rgba(105,101,219,0.25), transparent)",
        filter: "blur(10px)",
        zIndex: 0,
      }}
    />
    <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.05fr 1fr" },
          gap: { xs: 6, md: 4 },
          alignItems: "center",
        }}
      >
        <Box>
          <Chip
            label="Now in collaborative beta"
            size="small"
            sx={{
              mb: 3,
              bgcolor: "rgba(105,101,219,0.12)",
              color: "primary.light",
              border: "1px solid rgba(105,101,219,0.35)",
              fontFamily: mono,
              fontSize: 12,
            }}
          />
          <Typography
            variant="h1"
            sx={{ fontSize: { xs: 40, md: 58 }, lineHeight: 1.08, mb: 3 }}
          >
            An infinite canvas for teams who think out loud
          </Typography>
          <Typography
            sx={{
              fontSize: 18,
              color: "text.secondary",
              maxWidth: 480,
              mb: 4.5,
            }}
          >
            Sketch, diagram, and plan together in real time — no boundaries, no
            page limits, just space to think.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button
              size="large"
              variant="contained"
              disableElevation
              endIcon={<ArrowOutwardIcon sx={{ fontSize: 16 }} />}
              sx={{
                background: gradient,
                px: 3.5,
                py: 1.4,
                borderRadius: "10px",
                fontSize: 15.5,
                "&:hover": { background: gradient, filter: "brightness(1.08)" },
              }}
            >
              Start drawing — it&rsquo;s free
            </Button>
            <Button
              size="large"
              variant="outlined"
              sx={{
                px: 3.5,
                py: 1.4,
                borderRadius: "10px",
                fontSize: 15.5,
                borderColor: "divider",
                color: "text.primary",
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: "rgba(105,101,219,0.08)",
                },
              }}
            >
              Watch it in action
            </Button>
          </Stack>
        </Box>

        <CanvasMockup />
      </Box>
    </Container>
  </Box>
);

/* ------------------------------------------------------------------ */
/* Feature cards                                                       */
/* ------------------------------------------------------------------ */

const features = [
  {
    icon: GestureIcon,
    title: "Infinite canvas",
    desc: "Zoom out forever. Your ideas were never meant to fit on one page.",
  },
  {
    icon: GroupsIcon,
    title: "Live cursors",
    desc: "See every teammate's cursor and selection the instant it moves.",
  },
  {
    icon: CategoryIcon,
    title: "Shape library",
    desc: "Rectangles, arrows, sticky notes, and freehand — hand-drawn charm built in.",
  },
  {
    icon: HistoryIcon,
    title: "Version history",
    desc: "Rewind to any point. Nothing you draw is ever really gone.",
  },
  {
    icon: IosShareIcon,
    title: "Export anywhere",
    desc: "Ship to PNG, SVG, or straight into your docs and decks.",
  },
  {
    icon: WifiOffIcon,
    title: "Works offline",
    desc: "Keep sketching on a plane. Marq syncs the moment you reconnect.",
  },
];

const FeatureCards = () => (
  <Box id="features" sx={{ py: { xs: 8, md: 12 } }}>
    <Container maxWidth="lg">
      <Box sx={{ maxWidth: 560, mb: 6 }}>
        <SectionEyebrow>Features</SectionEyebrow>
        <Typography variant="h2" sx={{ fontSize: { xs: 30, md: 38 }, mb: 1.5 }}>
          Everything a whiteboard should&rsquo;ve been
        </Typography>
        <Typography sx={{ color: "text.secondary", fontSize: 16.5 }}>
          Built for the moments between meetings — where ideas actually take
          shape.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "repeat(3, 1fr)",
          },
          gap: 2.5,
        }}
      >
        {features.map(({ icon: Icon, title, desc }) => (
          <Box
            key={title}
            sx={{
              p: 3.5,
              borderRadius: "14px",
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              transition: "border-color 0.2s, transform 0.2s",
              "&:hover": {
                borderColor: "primary.main",
                transform: "translateY(-3px)",
              },
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "10px",
                display: "grid",
                placeItems: "center",
                bgcolor: "rgba(105,101,219,0.12)",
                mb: 2.5,
              }}
            >
              <Icon sx={{ fontSize: 20, color: "primary.light" }} />
            </Box>
            <Typography sx={{ fontWeight: 600, fontSize: 17, mb: 1 }}>
              {title}
            </Typography>
            <Typography
              sx={{ color: "text.secondary", fontSize: 14.5, lineHeight: 1.6 }}
            >
              {desc}
            </Typography>
          </Box>
        ))}
      </Box>
    </Container>
  </Box>
);

/* ------------------------------------------------------------------ */
/* How it works — steps linked by the marquee-dash motif               */
/* ------------------------------------------------------------------ */

const steps = [
  {
    n: "01",
    title: "Open a board",
    desc: "Start blank or from a template built for your team.",
  },
  {
    n: "02",
    title: "Invite your team",
    desc: "Drop in a link. Everyone draws on the same board, live.",
  },
  {
    n: "03",
    title: "Sketch and iterate",
    desc: "Wireframe, diagram, or brainstorm — the canvas doesn\u2019t judge.",
  },
  {
    n: "04",
    title: "Share the result",
    desc: "Export a snapshot or hand over the live board.",
  },
];

const HowItWorks = () => (
  <Box
    id="how-it-works"
    sx={{ py: { xs: 8, md: 12 }, bgcolor: "background.paper" }}
  >
    <Container maxWidth="lg">
      <Box sx={{ maxWidth: 560, mb: 7 }}>
        <SectionEyebrow>How it works</SectionEyebrow>
        <Typography variant="h2" sx={{ fontSize: { xs: 30, md: 38 } }}>
          From blank board to shipped idea
        </Typography>
      </Box>

      <Box sx={{ position: "relative" }}>
        {/* connecting dashed line — echoes the marquee selection in the hero */}
        <Box
          sx={{
            position: "absolute",
            top: 19,
            left: 0,
            right: 0,
            height: 0,
            borderTop: "1.5px dashed rgba(105,101,219,0.4)",
            display: { xs: "none", md: "block" },
          }}
        />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" },
            gap: { xs: 4, md: 3 },
          }}
        >
          {steps.map((s) => (
            <Box key={s.n} sx={{ position: "relative" }}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: "10px",
                  border: "1.5px dashed",
                  borderColor: "primary.main",
                  bgcolor: "background.default",
                  display: "grid",
                  placeItems: "center",
                  fontFamily: mono,
                  fontSize: 13,
                  color: "primary.light",
                  mb: 2.5,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {s.n}
              </Box>
              <Typography sx={{ fontWeight: 600, fontSize: 16.5, mb: 1 }}>
                {s.title}
              </Typography>
              <Typography
                sx={{
                  color: "text.secondary",
                  fontSize: 14.5,
                  lineHeight: 1.6,
                }}
              >
                {s.desc}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  </Box>
);

/* ------------------------------------------------------------------ */
/* Technology stack                                                    */
/* ------------------------------------------------------------------ */

const stack = [
  { name: "React", note: "UI runtime" },
  { name: "TypeScript", note: "type safety" },
  { name: "Material UI", note: "component layer" },
  { name: "WebSockets", note: "live sync" },
  { name: "CRDT engine", note: "conflict-free edits" },
  { name: "Canvas / WebGL", note: "render layer" },
];

const TechStack = () => (
  <Box id="stack" sx={{ py: { xs: 8, md: 12 } }}>
    <Container maxWidth="lg">
      <Box sx={{ maxWidth: 560, mb: 6 }}>
        <SectionEyebrow>Technology</SectionEyebrow>
        <Typography variant="h2" sx={{ fontSize: { xs: 30, md: 38 }, mb: 1.5 }}>
          Built for speed, tuned for scale
        </Typography>
        <Typography sx={{ color: "text.secondary", fontSize: 16.5 }}>
          A rendering and sync layer designed to keep thousands of shapes fluid.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3, 1fr)" },
          gap: 2,
        }}
      >
        {stack.map((t) => (
          <Box
            key={t.name}
            sx={{
              p: 2.5,
              borderRadius: "12px",
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            <Typography
              sx={{ fontFamily: mono, fontSize: 15, fontWeight: 500, mb: 0.5 }}
            >
              {t.name}
            </Typography>
            <Typography
              sx={{ fontFamily: mono, fontSize: 12, color: "text.secondary" }}
            >
              {t.note}
            </Typography>
          </Box>
        ))}
      </Box>
    </Container>
  </Box>
);

/* ------------------------------------------------------------------ */
/* Footer                                                               */
/* ------------------------------------------------------------------ */

const footerColumns = [
  { title: "Product", links: ["Features", "Pricing", "Changelog"] },
  { title: "Resources", links: ["Docs", "Templates", "Community"] },
  { title: "Company", links: ["About", "Blog", "Careers"] },
  { title: "Legal", links: ["Privacy", "Terms"] },
];

const Footer = () => (
  <Box
    component="footer"
    sx={{ borderTop: "1px solid", borderColor: "divider", pt: 7, pb: 4 }}
  >
    <Container maxWidth="lg">
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1.4fr repeat(4, 1fr)" },
          gap: 4,
          mb: 6,
        }}
      >
        <Box>
          <Stack
            direction="row"
          
            spacing={1.2}
            sx={{ mb: 2 }}
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
            <Typography sx={{ fontWeight: 800, fontSize: 17 }}>Marq</Typography>
          </Stack>
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: 14,
              maxWidth: 240,
              mb: 2.5,
            }}
          >
            The infinite canvas for teams who think in space, not slides.
          </Typography>
          <Stack direction="row" spacing={1}>
            <IconButton
              size="small"
              sx={{
                color: "text.secondary",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <GitHubIcon sx={{ fontSize: 17 }} />
            </IconButton>
            <IconButton
              size="small"
              sx={{
                color: "text.secondary",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <TwitterIcon sx={{ fontSize: 17 }} />
            </IconButton>
          </Stack>
        </Box>

        {footerColumns.map((col) => (
          <Box key={col.title}>
            <Typography sx={{ fontWeight: 600, fontSize: 13.5, mb: 2 }}>
              {col.title}
            </Typography>
            <Stack spacing={1.3}>
              {col.links.map((link) => (
                <Typography
                  key={link}
                  component="a"
                  href="#"
                  sx={{
                    fontSize: 14,
                    color: "text.secondary",
                    textDecoration: "none",
                    "&:hover": { color: "text.primary" },
                  }}
                >
                  {link}
                </Typography>
              ))}
            </Stack>
          </Box>
        ))}
      </Box>

      <Divider sx={{ borderColor: "divider", mb: 3 }} />

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
      >
        <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
          © 2026 Marq. All rights reserved.
        </Typography>
        <Typography
          sx={{ fontFamily: mono, fontSize: 12, color: "text.secondary" }}
        >
          built with an infinite canvas
        </Typography>
      </Stack>
    </Container>
  </Box>
);

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

const LandingPage = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Navbar />
      <Hero />
      <FeatureCards />
      <HowItWorks />
      <TechStack />
      <Footer />
    </Box>
  </ThemeProvider>
);

export default LandingPage;

/**
 * Dashboard.tsx
 * -----------------------------------------------------------------------
 * The landing screen after login for "Sketch Velvet" — shows every board
 * the user has created, a way to start a new one, and account access
 * (profile / logout) via the avatar menu in the top bar.
 *
 * Continues the same design system as LoginPage / SignupPage:
 * dark mode, #6965DB primary, Inter, 20px card radius, soft shadows.
 *
 * Dependencies (install if you don't already have them):
 *   npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
 *
 * Font — add to your index.html:
 *   <link rel="preconnect" href="https://fonts.googleapis.com">
 *   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
 *
 * Usage:
 *   import Dashboard from './Dashboard';
 *   export default function App() {
 *     return <Dashboard />;
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
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField,
  InputAdornment,
  DialogContent,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { keyframes } from "@emotion/react";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { boardApi } from "../../api/board.api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { OpenInNew } from "@mui/icons-material";

/* ------------------------------------------------------------------ */
/* Theme — same tokens as the rest of the Sketch Velvet UI             */
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
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
          fontWeight: 600,
          transition: "transform 200ms ease, filter 200ms ease",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: "#1A1A1F",
          border: "1px solid #2C2C35",
          borderRadius: 12,
          boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
        },
      },
    },
  },
});

const border = "#2C2C35";
const placeholder = "#6B7280";
const softShadow = "0 20px 50px rgba(0,0,0,0.25)";
const gradient = "linear-gradient(135deg, #6965DB 0%, #4F46E5 100%)";
// const dotGrid = "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)";

const fadeIn = keyframes`
  from { opacity: 0; } to { opacity: 1; }
`;
const staggerFade = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* ------------------------------------------------------------------ */
/* Mock data                                                           */
/* ------------------------------------------------------------------ */

interface Board {
  id: string;
  title: string;
  updatedAt: string;
  collaborators: number;
}

/* ------------------------------------------------------------------ */
/* Board card                                                          */
/* ------------------------------------------------------------------ */

const BoardCard = ({
  board,
  index,
  getAllBoards,
  onRename,
}: {
  board: Board;
  index: number;
  getAllBoards: () => Promise<void>;
  onRename: (id: string, newName: string) => void;
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [draftName, setDraftName] = React.useState(board.title);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const open = Boolean(anchorEl);

  const startRename = () => {
    setDraftName(board.title);
    setIsEditing(true);
    setAnchorEl(null);
  };

  const commitRename = () => {
    const trimmed = draftName.trim();
    if (trimmed && trimmed !== board.title) onRename(board.id, trimmed);
    setIsEditing(false);
  };

  const cancelRename = () => {
    setDraftName(board.title);
    setIsEditing(false);
  };

  React.useEffect(() => {
    if (isEditing) inputRef.current?.select();
  }, [isEditing]);

  const handleDelete = async (id: string) => {
    setAnchorEl(null);
    await boardApi.delete(id);
    getAllBoards();
  };

  const updatedAt = new Date(board.updatedAt).toLocaleDateString();

  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: "relative",
        p: 2,
        borderRadius: "20px",
        border: `1px solid ${border}`,
        bgcolor: "background.paper",
        transition:
          "transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease",
        animation: `${staggerFade} 450ms ease ${index * 70}ms both`,
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: softShadow,
        },
      }}
    >
      <Stack direction="row">
        <Box sx={{ minWidth: 0, flex: 1 }}>
          {isEditing ? (
            <TextField
              inputRef={inputRef}
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onBlur={commitRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  commitRename();
                }
                if (e.key === "Escape") {
                  e.preventDefault();
                  cancelRename();
                }
              }}
              autoFocus
              size="small"
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontSize: 15,
                  fontWeight: 600,
                  borderRadius: "8px",
                  "& fieldset": { borderColor: "#6965DB" },
                },
                "& .MuiOutlinedInput-input": { py: 0.5, px: 1 },
              }}
            />
          ) : (
            <Typography
              noWrap
              onDoubleClick={(e) => {
                e.stopPropagation();
                startRename();
              }}
              sx={{ fontWeight: 600, fontSize: 15 }}
            >
              {board.title}
            </Typography>
          )}
          <Stack direction="row" spacing={0.6} sx={{ mt: 0.5 }}>
            <AccessTimeIcon sx={{ fontSize: 13, color: placeholder }} />
            <Typography sx={{ fontSize: 12.5, color: "text.secondary" }}>
              Edited {updatedAt}
            </Typography>
          </Stack>
        </Box>

        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setAnchorEl(e.currentTarget);
          }}
          sx={{ color: "text.secondary", mt: -0.5, mr: -0.5 }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Stack>

      {/* collaborator avatars */}
      {/* {board.collaborators > 0 && (
        <Stack direction="row" sx={{ mt: 1.5 }}>
          {Array.from({ length: Math.min(board.collaborators, 3) }).map(
            (_, i) => (
              <Avatar
                key={i}
                sx={{
                  width: 22,
                  height: 22,
                  fontSize: 10,
                  bgcolor: "#8B88F8",
                  border: "2px solid #1A1A1F",
                  ml: i === 0 ? 0 : -0.8,
                }}
              >
                {" "}
              </Avatar>
            ),
          )}
          {board.collaborators > 3 && (
            <Typography
              sx={{
                fontSize: 11.5,
                color: "text.secondary",
                ml: 1,
                alignSelf: "center",
              }}
            >
              +{board.collaborators - 3}
            </Typography>
          )}
        </Stack>
      )} */}

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => navigate(`/board/${board.id}`)}
          sx={{ fontSize: 14, gap: 0 }}
        >
          <ListItemIcon>
            <OpenInNew fontSize="small" sx={{ color: "text.secondary" }} />
          </ListItemIcon>
          <ListItemText>Open</ListItemText>
        </MenuItem>

        <MenuItem onClick={startRename} sx={{ fontSize: 14, gap: 0 }}>
          <ListItemIcon>
            <DriveFileRenameOutlineIcon
              fontSize="small"
              sx={{ color: "text.secondary" }}
            />
          </ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>

        <Divider sx={{ borderColor: border, my: 0.5 }} />
        <MenuItem
          onClick={() => handleDelete(board.id)}
          sx={{ fontSize: 14, gap: 0, color: "#EF4444" }}
        >
          <ListItemIcon>
            <DeleteOutlineIcon fontSize="small" sx={{ color: "#EF4444" }} />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

/* ------------------------------------------------------------------ */
/* Create-new-board card                                               */
/* ------------------------------------------------------------------ */

const CreateBoardCard = ({ onClick }: { onClick?: () => void }) => (
  <Box
    onClick={onClick}
    sx={{
      height: "100%",
      minHeight: 234,
      borderRadius: "20px",
      border: `1.5px dashed ${border}`,
      bgcolor: "rgba(105,101,219,0.04)",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      p: 3,
      transition:
        "border-color 200ms ease, background-color 200ms ease, transform 200ms ease",
      animation: `${staggerFade} 450ms ease both`,
      "&:hover": {
        borderColor: "primary.main",
        bgcolor: "rgba(105,101,219,0.08)",
        transform: "translateY(-3px)",
      },
    }}
  >
    <Box
      sx={{
        width: 48,
        height: 48,
        borderRadius: "14px",
        background: gradient,
        display: "grid",
        placeItems: "center",
        mb: 2,
      }}
    >
      <AddIcon sx={{ color: "#fff", fontSize: 26 }} />
    </Box>
    <Typography sx={{ fontWeight: 600, fontSize: 15, mb: 0.5 }}>
      Create New Board
    </Typography>
    <Typography sx={{ fontSize: 13, color: "text.secondary", maxWidth: 180 }}>
      Start with a blank canvas
    </Typography>
  </Box>
);

/* ------------------------------------------------------------------ */
/* Top bar — logo, search, new board button, avatar menu               */
/* ------------------------------------------------------------------ */

const TopBar = ({ onCreate }: { onCreate?: () => void }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { user } = useAuth();

  if (!user) return;

  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        bgcolor: "rgba(15,15,17,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${border}`,
      }}
    >
      <Stack direction="row" sx={{ px: { xs: 2.5, md: 4 }, py: 1.8 }}>
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
            sx={{
              fontWeight: 700,
              fontSize: 17,
              display: { xs: "none", sm: "block" },
            }}
          >
            Sketch Velvet
          </Typography>
        </Stack>

        <TextField
          placeholder="Search boards..."
          size="small"
          sx={{
            display: { xs: "none", md: "block" },
            width: 280,
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              bgcolor: "background.paper",
              fontSize: 14,
              "& fieldset": { borderColor: border },
              "&:hover fieldset": { borderColor: "#3A3A45" },
              "&.Mui-focused fieldset": {
                borderColor: "#6965DB",
                borderWidth: 1.5,
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: placeholder }} />
              </InputAdornment>
            ),
          }}
        />

        <Stack direction="row" spacing={2}>
          <Button
            onClick={onCreate}
            startIcon={<AddIcon sx={{ fontSize: 18 }} />}
            disableElevation
            sx={{
              display: { xs: "none", sm: "inline-flex" },
              background: gradient,
              color: "#fff",
              px: 2.2,
              py: 0.9,
              fontSize: 14,
              "&:hover": {
                background: gradient,
                filter: "brightness(1.1)",
                transform: "translateY(-1px)",
              },
            }}
          >
            New Board
          </Button>

          <IconButton
            onClick={onCreate}
            sx={{
              display: { xs: "inline-flex", sm: "none" },
              color: "primary.light",
            }}
          >
            <AddIcon />
          </IconButton>

          <IconButton
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ p: 0.3 }}
          >
            <Avatar
              sx={{
                width: 34,
                height: 34,
                fontSize: 13,
                bgcolor: "primary.main",
                fontWeight: 600,
              }}
            ></Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{ sx: { minWidth: 220, mt: 1 } }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
                {user.name}
              </Typography>
              <Typography sx={{ fontSize: 12.5, color: "text.secondary" }}>
                {user.email}
              </Typography>
            </Box>
            <Divider sx={{ borderColor: border }} />
            <MenuItem
              onClick={() => setAnchorEl(null)}
              sx={{ fontSize: 14, py: 1.2, gap: 0 }}
            >
              <ListItemIcon>
                <PersonOutlineIcon
                  fontSize="small"
                  sx={{ color: "text.secondary" }}
                />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </MenuItem>
            <Divider sx={{ borderColor: border }} />
            <MenuItem
              onClick={() => setAnchorEl(null)}
              sx={{ fontSize: 14, py: 1.2, gap: 0, color: "#EF4444" }}
            >
              <ListItemIcon>
                <LogoutIcon fontSize="small" sx={{ color: "#EF4444" }} />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Stack>
      </Stack>
    </Box>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

const Dashboard = () => {
  const [boardList, setBoardList] = React.useState<Board[]>([]);

  const [openCreateDialog, setOpenCreateDialog] = React.useState(false);
  const [boardName, setBoardName] = React.useState("");

  const createBoard = async () => {
    try {
      const { data } = await boardApi.create(
        boardName.trim() || "Untitled Board",
      );

      const updatedAt = new Date(data.board.updatedAt).toLocaleDateString();

      if (data.success) {
        const newBoard: Board = {
          id: data.board.id,
          title: boardName.trim() || "Untitled Board",
          updatedAt,
          collaborators: 1,
        };

        setBoardList((prev) => [newBoard, ...prev]);
      }
    } catch (err) {}

    setOpenCreateDialog(false);
    setBoardName("");
  };

  const handleCreate = () => {
    setOpenCreateDialog(true);
  };

  const handleRename = async (id: string, newName: string) => {
    setBoardList((prev) =>
      prev.map((b) => (b.id === id ? { ...b, title: newName } : b)),
    );
    await boardApi.update(id, { title: newName });
  };

  const getAllBoards = async () => {
    const { data } = await boardApi.getAll();
    setBoardList(data.boards);
  };

  React.useEffect(() => {
    getAllBoards();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Dialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        PaperProps={{
          sx: {
            bgcolor: "background.paper",
            borderRadius: "20px",
            border: `1px solid ${border}`,
            minWidth: 420,
            p: 1,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: 22,
            pb: 1,
          }}
        >
          Create New Board
        </DialogTitle>

        <DialogContent>
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: 14,
              mb: 2,
            }}
          >
            Give your board a name. You can always rename it later.
          </Typography>

          <TextField
            autoFocus
            fullWidth
            label="Board name"
            placeholder="Untitled Board"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                createBoard();
              }
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
            }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => {
              setOpenCreateDialog(false);
              setBoardName("");
            }}
            sx={{
              color: "text.secondary",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            disableElevation
            onClick={createBoard}
            sx={{
              background: gradient,
              px: 3,
              "&:hover": {
                background: gradient,
                filter: "brightness(1.08)",
              },
            }}
          >
            Create Board
          </Button>
        </DialogActions>
      </Dialog>

      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <TopBar onCreate={handleCreate} />

        <Box
          sx={{
            px: { xs: 2.5, md: 4 },
            py: { xs: 4, md: 5 },
            maxWidth: 1280,
            mx: "auto",
            animation: `${fadeIn} 500ms ease both`,
          }}
        >
          <Stack direction="row" sx={{ mb: 3.5 }}>
            <Box>
              <Typography
                sx={{ fontWeight: 700, fontSize: { xs: 24, md: 28 }, mb: 0.5 }}
              >
                Your Boards
              </Typography>
              <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
                {boardList.length} board{boardList.length !== 1 ? "s" : ""} ·
                pick up where you left off
              </Typography>
            </Box>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 2.5,
            }}
          >
            <CreateBoardCard onClick={handleCreate} />
            {boardList.map((board, i) => (
              <BoardCard
                key={board.id}
                board={board}
                index={i + 1}
                onRename={handleRename}
                getAllBoards={getAllBoards}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;

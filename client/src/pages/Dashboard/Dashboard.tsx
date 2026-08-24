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
import Share from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { boardApi } from "../../api/board.api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { OpenInNew } from "@mui/icons-material";
import { authApi } from "../../api/auth.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

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

const fadeIn = keyframes`
  from { opacity: 0; } to { opacity: 1; }
`;
const staggerFade = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

interface Board {
  id: string;
  title: string;
  updatedAt: string;
  sharedMembers: number;
}

interface owner {
  id: string;
  name: string;
  email: string;
}

interface SharedBoard extends Board {
  owner: owner;
}

export type Role = "EDITOR" | "VIEWER";

interface BoardMember {
  userId: string;
  name: string;
  email: string;
  role: "OWNER" | Role;
  createdAt?: string;
}

function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: unknown } } })
      .response;

    if (typeof response?.data?.message === "string") {
      return response.data.message;
    }
  }

  return error instanceof Error ? error.message : "Something went wrong.";
}

const ShareBoardDialog = ({
  boardId,
  onClose,
}: {
  boardId: string | null;
  onClose: () => void;
}) => {
  const queryClient = useQueryClient();
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState<Role>("VIEWER");

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["boards", boardId, "members"],
    queryFn: () => boardApi.getMembers(boardId!),
    enabled: Boolean(boardId),
    select: ({ data }) => data.members as BoardMember[],
  });

  const addMemberMutation = useMutation({
    mutationFn: ({ email, role }: { email: string; role: Role }) =>
      boardApi.share(boardId!, email, role),
    onSuccess: () => {
      setEmail("");
      queryClient.invalidateQueries({
        queryKey: ["boards", boardId, "members"],
      });
      toast.success("Collaborator added successfully.");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: (userId: string) => boardApi.removeMember(boardId!, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["boards", boardId, "members"],
      });
      toast.success("Collaborator removed successfully.");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const handleAddMember = () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      toast.error("Enter an email address.");
      return;
    }

    addMemberMutation.mutate({ email: trimmedEmail, role });
  };

  const formatAccessDate = (createdAt?: string) =>
    createdAt ? new Date(createdAt).toLocaleDateString() : "Not available";

  return (
    <Dialog
      open={Boolean(boardId)}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            bgcolor: "background.paper",
            borderRadius: "20px",
            border: `1px solid ${border}`,
          },
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, fontSize: 22 }}>
        Share board
      </DialogTitle>
      <DialogContent dividers sx={{ borderColor: border }}>
        <Typography sx={{ color: "text.secondary", fontSize: 14, mb: 2 }}>
          Invite collaborators to work on this board.
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
          <TextField
            label="Email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            fullWidth
            size="small"
          />
          <TextField
            select
            label="Access"
            value={role}
            onChange={(event) => setRole(event.target.value as Role)}
            size="small"
            sx={{ minWidth: 130 }}
          >
            <MenuItem value="EDITOR">Editor</MenuItem>
            <MenuItem value="VIEWER">Viewer</MenuItem>
          </TextField>
          <Button
            variant="contained"
            onClick={handleAddMember}
            disabled={addMemberMutation.isPending}
            sx={{ background: gradient, whiteSpace: "nowrap" }}
          >
            {addMemberMutation.isPending ? "Adding..." : "Add"}
          </Button>
        </Stack>

        <Typography sx={{ fontWeight: 600, mt: 3, mb: 1.2 }}>
          People with access
        </Typography>

        <Stack spacing={1}>
          {isLoading ? (
            <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
              Loading members...
            </Typography>
          ) : (
            members.map((member) => (
              <Stack
                key={member.userId}
                direction="row"
                spacing={1.2}
                sx={{
                  p: 1.2,
                  border: `1px solid ${border}`,
                  borderRadius: "12px",
                  alignItems: "center",
                }}
              >
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    bgcolor: "primary.main",
                    fontSize: 13,
                  }}
                >
                  {member.name.slice(0, 1).toUpperCase()}
                </Avatar>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography noWrap sx={{ fontSize: 14, fontWeight: 600 }}>
                    {member.name}
                  </Typography>
                  <Typography
                    noWrap
                    sx={{ color: "text.secondary", fontSize: 12.5 }}
                  >
                    {member.email}
                  </Typography>
                  <Typography
                    sx={{ color: "text.secondary", fontSize: 11.5, mt: 0.3 }}
                  >
                    {member.role.toLowerCase()} · Access since{" "}
                    {formatAccessDate(member.createdAt)}
                  </Typography>
                </Box>
                {member.role !== "OWNER" && (
                  <Button
                    color="error"
                    size="small"
                    onClick={() => removeMemberMutation.mutate(member.userId)}
                    disabled={removeMemberMutation.isPending}
                  >
                    Remove
                  </Button>
                )}
              </Stack>
            ))
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={() => {
            setEmail("");
            onClose();
          }}
          sx={{ color: "text.secondary" }}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const BoardThumbnail = () => (
  <Box
    sx={{
      position: "relative",
      height: 128,
      borderRadius: "12px",
      border: `1px solid ${border}`,
      bgcolor: "#131316",
      backgroundImage:
        "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
      backgroundSize: "16px 16px",
      overflow: "hidden",
      mb: 2,
    }}
  >
    <Box
      sx={{
        position: "absolute",
        top: -30,
        right: -20,
        width: 110,
        height: 110,
        borderRadius: "50%",
        background: `radial-gradient(closest-side, ${"#6965DB"}33, transparent)`,
        filter: "blur(10px)",
      }}
    />
    <Box
      sx={{
        position: "absolute",
        top: "28%",
        left: "14%",
        width: 54,
        height: 36,
        borderRadius: "7px",
        border: `2px solid ${"#6965DB"}`,
      }}
    />
    <Box
      sx={{
        position: "absolute",
        top: "38%",
        left: "52%",
        width: 44,
        height: 44,
        borderRadius: "50%",
        border: `2px solid ${"#6965DB"}`,
        opacity: 0.7,
      }}
    />
  </Box>
);

const BoardCard = ({
  board,
  index,
  onDelete,
  onRename,
  onShare,
  sharedMembers,
}: {
  board: SharedBoard;
  index: number;
  onDelete: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  onShare: (id: string) => void;
  sharedMembers: number;
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [draftName, setDraftName] = React.useState(board.title);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const open = Boolean(anchorEl);

  const startRename = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.preventDefault();
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

  const handleDelete = (id: string) => {
    setAnchorEl(null);
    onDelete(id);
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
      <BoardThumbnail />

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
                startRename(e);
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

      {sharedMembers > 0 && (
        <Stack direction="row" sx={{ mt: 1.5 }}>
          {Array.from({ length: Math.min(sharedMembers, 3) }).map((_, i) => (
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
          ))}
          {sharedMembers > 3 && (
            <Typography
              sx={{
                fontSize: 11.5,
                color: "text.secondary",
                ml: 1,
                alignSelf: "center",
              }}
            >
              +{sharedMembers - 3}
            </Typography>
          )}
        </Stack>
      )}

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

        {!board.owner && (
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              onShare(board.id);
            }}
            sx={{ fontSize: 14, gap: 0 }}
          >
            <ListItemIcon>
              <Share fontSize="small" sx={{ color: "text.secondary" }} />
            </ListItemIcon>
            <ListItemText>Share</ListItemText>
          </MenuItem>
        )}

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

const TopBar = ({
  search,
  setSearch,
}: {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { user } = useAuth();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: ({ data }: any) => {
      if (data.success) {
        queryClient.setQueryData(["auth", "me"], {
          data: {
            user: null,
          },
        });

        navigate("/");
      }
    },
  });

  if (!user) return;

  const handleLogout = () => logoutMutation.mutate();

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
      <Stack
        direction="row"
        sx={{
          px: { xs: 2.5, md: 4 },
          py: 1.8,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Stack
          direction="row"
          spacing={1.2}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: 30,
              height: 30,
              borderRadius: "8px",
              background: gradient,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: placeholder }} />
                </InputAdornment>
              ),
            },
          }}
        />

        <Stack
          direction="row"
          spacing={2}
          style={{ display: "flex", alignItems: "center", gap: "1rem" }}
        >
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
            slotProps={{
              paper: {
                sx: {
                  minWidth: 220,
                  mt: 1,
                },
              },
            }}
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
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
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

const Dashboard = () => {
  const [openCreateDialog, setOpenCreateDialog] = React.useState(false);
  const [boardName, setBoardName] = React.useState("");
  const [sharedBoardId, setSharedBoardId] = React.useState<string | null>(null);
  const [boardView, setBoardView] = React.useState<"owned" | "shared">("owned");
  const queryClient = useQueryClient();

  const { data: boards = { ownedBoards: [], sharedBoards: [] } } = useQuery({
    queryKey: ["boards"],
    queryFn: boardApi.getAll,
    select: ({ data }) => data.boards,
  });

  const [search, setSearch] = React.useState("");
  const filteredOwnedBoards = React.useMemo(() => {
    return boards?.ownedBoards.filter((board: Board) =>
      board.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [boards?.ownedBoards, search]);

  const filteredSharedBoards = React.useMemo(() => {
    return boards?.sharedBoards.filter((board: Board) =>
      board.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [boards?.sharedBoards, search]);

  const boardList =
    boardView === "owned" ? filteredOwnedBoards : filteredSharedBoards;

  const createBoardMutation = useMutation({
    mutationFn: boardApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["boards"] }),
  });

  const renameBoardMutation = useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) =>
      boardApi.update(id, { title }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["boards"] }),
  });

  const deleteBoardMutation = useMutation({
    mutationFn: boardApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["boards"] }),
  });

  const createBoard = () => {
    createBoardMutation.mutate(boardName.trim() || "Untitled Board");
    setOpenCreateDialog(false);
    setBoardName("");
  };

  const handleCreate = () => {
    setOpenCreateDialog(true);
  };

  const handleRename = (id: string, title: string) =>
    renameBoardMutation.mutate({ id, title });

  const handleDelete = (id: string) => deleteBoardMutation.mutate(id);

  return (
    <ThemeProvider theme={theme}>
      <ShareBoardDialog
        boardId={sharedBoardId}
        onClose={() => setSharedBoardId(null)}
      />
      <Dialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        slotProps={{
          paper: {
            sx: {
              bgcolor: "background.paper",
              borderRadius: "20px",
              border: `1px solid ${border}`,
              minWidth: 420,
              p: 1,
            },
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
            disabled={createBoardMutation.isPending}
            sx={{
              background: gradient,
              px: 3,
              "&:hover": {
                background: gradient,
                filter: "brightness(1.08)",
              },
            }}
          >
            {createBoardMutation.isPending ? "Creating..." : "Create Board"}
          </Button>
        </DialogActions>
      </Dialog>

      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <TopBar search={search} setSearch={setSearch} />

        <Box
          sx={{
            px: { xs: 2.5, md: 4 },
            py: { xs: 4, md: 5 },
            maxWidth: 1280,
            mx: "auto",
            animation: `${fadeIn} 500ms ease both`,
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{
              mb: 3.5,
              justifyContent: "space-between",
              alignItems: { sm: "center" },
            }}
          >
            <Box>
              <Typography
                sx={{ fontWeight: 700, fontSize: { xs: 24, md: 28 }, mb: 0.5 }}
              >
                My Boards
              </Typography>
              <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
                {boardList.length || 0} board{boardList.length > 1 ? "s" : ""} ·
                pick up where you left off
              </Typography>
            </Box>

            <Box
              sx={{
                display: "inline-flex",
                p: 0.5,
                gap: 0.5,
                border: `1px solid ${border}`,
                borderRadius: "12px",
                bgcolor: "background.paper",
              }}
            >
              <Button
                size="small"
                onClick={() => setBoardView("owned")}
                sx={{
                  px: 1.5,
                  color: boardView === "owned" ? "#fff" : "text.secondary",
                  background: boardView === "owned" ? gradient : "transparent",
                  "&:hover": {
                    background:
                      boardView === "owned"
                        ? gradient
                        : "rgba(255,255,255,0.05)",
                  },
                }}
              >
                Owned Boards ({filteredOwnedBoards.length})
              </Button>
              <Button
                size="small"
                onClick={() => setBoardView("shared")}
                sx={{
                  px: 1.5,
                  color: boardView === "shared" ? "#fff" : "text.secondary",
                  background: boardView === "shared" ? gradient : "transparent",
                  "&:hover": {
                    background:
                      boardView === "shared"
                        ? gradient
                        : "rgba(255,255,255,0.05)",
                  },
                }}
              >
                Shared Boards ({filteredSharedBoards.length})
              </Button>
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
              gridAutoRows: "250px",
            }}
          >
            {boardView === "owned" && (
              <CreateBoardCard onClick={handleCreate} />
            )}
            {boardList.map((board: SharedBoard, i: number) => (
              <BoardCard
                key={board.id}
                board={board}
                sharedMembers={board.sharedMembers}
                index={i + 1}
                onRename={handleRename}
                onDelete={handleDelete}
                onShare={setSharedBoardId}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;

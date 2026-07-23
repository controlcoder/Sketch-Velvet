import { Router } from "express";

import * as boardController from "../controllers/board.controller";

import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authenticate, boardController.createBoard);
router.get("/", authenticate, boardController.getBoards);
router.get("/:id", authenticate, boardController.getBoard);
router.patch("/:id", authenticate, boardController.updateBoard);
router.delete("/:id", authenticate, boardController.deleteBoard);

export default router;

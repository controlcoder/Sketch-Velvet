import { Router } from "express";

import * as boardController from "../controllers/board.controller";

import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authenticate, boardController.createBoard);
router.get("/", authenticate, boardController.getBoards);
router.get("/:id", authenticate, boardController.getBoard);
router.patch("/:id", authenticate, boardController.updateBoard);
router.delete("/:id", authenticate, boardController.deleteBoard);

//

router.post("/:id/share", authenticate, boardController.shareBoard);
router.get("/:id/members", authenticate, boardController.getBoardMembers);
router.delete(
  "/:boardId/members/:userId",
  authenticate,
  boardController.removeMember,
);
// router.patch("/boards/:id/members/:userId", authenticate, boardController.updateMember);

export default router;

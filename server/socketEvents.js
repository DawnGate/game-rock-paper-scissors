export const socketEvents = {
  // game
  FIND_GAME: "game:find",
  CANCEL_FIND_GAME: "game:find-cancel",
  WAITING_GAME: "game:waiting",
  FOUND_GAME: "game:found",
  CANCEL_GAME: "game:cancel",
  SEND_CHOICE_GAME: "game:send-choice",
  FINISH_GAME: "game:finish",
  TIMEOUT_GAME: "game:timeout",
  // leader board user
  INIT_LEADER_BOARD_USER: "leader-board-user:init",
  UPDATE_LEADER_BOARD_USER: "leader-board-user:update",
  // leader board
  INIT_LEADER_BOARD: "leader-board:init",
  UPDATE_LEADER_BOARD: "leader-board:update",
  // systems
  ERROR_SERVER: "server:error",
};

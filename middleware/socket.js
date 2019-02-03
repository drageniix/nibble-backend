let io;

module.exports = {
  init(server) {
    return (io = require("socket.io")(server));
  },
  getIO() {
    if (!io) throw new Error("No active websocket.");
    return io;
  }
};

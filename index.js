const http = require("http");
const app = require("./backend/app");
const server = http.createServer(app);

const { PORT } = process.env;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
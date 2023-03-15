import http from "node:http";

const serve = http.createServer((req, res) => {
  return res.end("teste");
});

serve.listen(3333);

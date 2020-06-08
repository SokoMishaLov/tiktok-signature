const Signer = require("./index");
const http = require("http");

(async function main() {
  try {
    const signer = new Signer();

    const port = process.env.PORT || 8080

    const server = http
      .createServer()
      .listen(port, "127.0.0.1")
      .on("listening", function () {
        console.log("TikTok Signature server started");
      });

    signer.init(); // !?

    server.on("request", (request, response) => {
      if (request.method === "POST" && request.url === "/signature") {
        var url = "";
        request.on("data", function (chunk) {
          url += chunk;
        });

        request.on("end", async function () {
          console.log("Received url: " + url);

          try {
            const verifyFp = await signer.getVerifyFp();
            const token = await signer.sign(url);
            let output = JSON.stringify({
              _signature: token,
              verifyFp: verifyFp,
            });
            response.writeHead(200, { "Content-Type": "application/json" });
            response.end(output);
            console.log("Sent result: " + output);
          } catch (err) {
            console.log(err);
          }
        });
      } else {
        response.statusCode = 404;
        response.end();
      }
    });

    await signer.close();
  } catch (err) {
    console.error(err);
  }
})();

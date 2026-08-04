const localtunnel = require('localtunnel');

(async () => {
  try {
    const tunnel = await localtunnel({ port: 8080 });
    console.log("TUNNEL_URL=" + tunnel.url);
    tunnel.on('close', () => {
      console.log("Tunnel closed");
    });
  } catch (err) {
    console.error("Tunnel error", err);
  }
})();

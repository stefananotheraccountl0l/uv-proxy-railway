import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
const port = process.env.PORT || 3000;

app.use(
  "/proxy/",
  createProxyMiddleware({
    target: "",
    changeOrigin: true,
    pathRewrite: (path) => path.replace(/^\/proxy/, ""),
    onProxyReq(proxyReq) {
      proxyReq.removeHeader("origin");
    },
    onProxyRes(proxyRes) {
      delete proxyRes.headers["content-security-policy"];
      delete proxyRes.headers["content-security-policy-report-only"];
      delete proxyRes.headers["x-frame-options"];
      delete proxyRes.headers["frame-options"];
    },
  })
);

app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>UV Proxy</title></head>
<body>
  <h1>UV Proxy on Railway</h1>
  <input type="text" id="url" placeholder="Enter full URL (https://example.com)" style="width:80%;" />
  <button onclick="go()">Go</button>
  <iframe id="frame" src="" style="width:100%; height:80vh; border:none; margin-top:10px;"></iframe>
  <script>
    function go() {
      let url = document.getElementById('url').value.trim();
      if (!url) return alert('Please enter a URL');
      document.getElementById('frame').src = '/proxy/' + encodeURIComponent(url);
    }
  </script>
</body>
</html>`);
});

app.listen(port, () => {
  console.log(\`UV Proxy running on port \${port}\`);
});

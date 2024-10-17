module.exports = {
  apps: [
    {
      name: "server",
      script: "./bin/server.js",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};

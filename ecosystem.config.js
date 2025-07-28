module.exports = {
  apps: [
    {
      name: "jobdedo-backend",
      script: "node ./dist/index.js",
      cwd: "./jobdedo-backend",
      env: {
        NODE_ENV: "production",
        PORT: 9000,
      },
    },
    {
      name: "jobdedo-frontend",
      script: "npm",
      args: "start",
      cwd: "./jobdedo-frontend",
      env: {
        NODE_ENV: "production",
        PORT: 3006,
      },
    },
  ],
};

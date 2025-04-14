module.exports = {
    apps: [
      {
        name: 'asfi_dev',
        script: 'app.js',
        watch: false,
        restart_delay: 5000,
        max_restarts: 10,
        autorestart: true,
        error_file: './logs/err.log',
        out_file: './logs/out.log',
      },
    ],
  };
  
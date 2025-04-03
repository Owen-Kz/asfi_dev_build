require('dotenv').config(); // Load environment variables
const WebSocket = require('ws');
const { spawn } = require('child_process');

const YOUTUBE_STREAM_KEY = process.env.YOUTUBE_STREAM_KEY || '3g9r-1r5v-9k9j-m06m-05xr';
const YOUTUBE_RTMP_URL = `rtmp://a.rtmp.youtube.com/live2/${YOUTUBE_STREAM_KEY}`;
const PORT = 5000;

const server = new WebSocket.Server({ port: PORT });

console.log(`WebSocket Server started on port ${PORT}`);

server.on('connection', (ws) => {
  console.log("Client connected");
  const ffmpeg = startFFmpeg();

  let buffer = [];

  ws.on('message', (message) => {
    buffer.push(message);
  
    if (buffer.length > 5) {  // Only write when enough chunks are collected
      const data = Buffer.concat(buffer);
      buffer = [];
      if (!ffmpeg.killed) {
        // Write raw data to FFmpeg stdin
        ffmpeg.stdin.write(data, (err) => {
          if (err) console.error('Error writing to FFmpeg stdin:', err);
        });
      }
    }
  });
  
  ws.on('close', () => {
    console.log("Client disconnected");
    stopFFmpeg(ffmpeg);
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
  });
});

/**
 * Starts the FFmpeg process and returns the instance.
 */
function startFFmpeg() {
  console.log("Starting FFmpeg stream...");
  const ffmpeg = spawn('ffmpeg', [
    '-re',
    '-i', 'pipe:0', // Read input from WebSocket
    '-c:v', 'libx264',
    '-preset', 'veryfast',  // Change from ultrafast to veryfast for better quality
    '-b:v', '4500k',  // Increase bitrate for YouTube (at least 4500k for 1080p)
    '-maxrate', '4500k',
    '-bufsize', '9000k',
    '-pix_fmt', 'yuv420p',
    '-g', '60',  // Increase GOP size (use 2x your FPS)
    '-r', '30',  // Set FPS to 30
    '-c:a', 'aac',
    '-b:a', '160k', // Increase audio bitrate
    '-ar', '44100',
    '-f', 'flv',
    YOUTUBE_RTMP_URL, // Send stream to YouTube
  ]);

  ffmpeg.stdin.on('error', (err) => console.error("FFmpeg stdin error:", err));

  ffmpeg.stderr.on('data', (data) => {
    console.error('FFmpeg stderr:', data.toString());
  });

  ffmpeg.on('exit', (code, signal) => {
    console.error(`FFmpeg exited with code ${code} and signal ${signal}`);
  });

  return ffmpeg;
}

/**
 * Stops the FFmpeg process gracefully and restarts it after 3 seconds.
 */
function stopFFmpeg(ffmpeg) {
  if (ffmpeg.stdin) {
    ffmpeg.stdin.end();
  }
  ffmpeg.kill('SIGINT');

  setTimeout(() => {
    console.log("Restarting FFmpeg...");
    startFFmpeg();
  }, 3000);
}

import express from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';
import cors from 'cors';

const app = express();
const prisma = new PrismaClient();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

ffmpeg.setFfmpegPath("C:\\ffmpeg\\ffmpeg.exe");  

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Upload Video
app.post('/api/videos/upload', upload.single('video'), async (req, res) => {
  const { originalname, size, path: filePath } = req.file;
  const newVideo = await prisma.video.create({
    data: {
      name: originalname,
      path: filePath,
      size,
      status: 'uploaded'
    }
  });
  res.json(newVideo);
});

// Trim Video
app.post('/api/videos/:id/trim', async (req, res) => {
  const { start, end } = req.body;
  const video = await prisma.video.findUnique({ where: { id: parseInt(req.params.id) } });
  const output = `uploads/trimmed-${Date.now()}.mp4`;

  ffmpeg(video.path)
    .setStartTime(start)
    .setDuration(end - start)
    .output(output)
    .on('end', async () => {
      await prisma.video.update({
        where: { id: video.id },
        data: { trimmedPath: output, status: 'trimmed' }
      });
      res.send("Trimmed successfully");
    })
    .on('error', err => {
      console.error("Error during trimming:", err);
      res.status(500).send({ message: "Error during trimming", error: err.message });
    })
    .run();
});

// Add Subtitles
app.post('/api/videos/:id/subtitles', async (req, res) => {
  const { text, start, end } = req.body;
  const video = await prisma.video.findUnique({ where: { id: parseInt(req.params.id) } });
  const output = `uploads/subtitled-${Date.now()}.mp4`;
  const subtitleFile = `uploads/${Date.now()}.srt`;

  // Create subtitle file.
  const subtitleContent = `1\n00:${start} --> 00:${end}\n${text}`;
  fs.writeFileSync(subtitleFile, subtitleContent);

  console.log(`Subtitle File Created: ${subtitleFile}`);
  console.log(`Video File Path: ${video.path}`);
  console.log(`Output File Path: ${output}`);
  console.log(`Absolute Video Path: ${path.resolve(video.path)}`);
  console.log(`Absolute Subtitle Path: ${path.resolve(subtitleFile)}`);

  ffmpeg(video.path)
    .outputOptions(`-vf subtitles=${path.resolve(subtitleFile)}`)
    .output(output)
    .on('end', async () => {
      await prisma.video.update({ where: { id: video.id }, data: { subtitlePath: output } });
      res.download(output);
    })
    .on('error', (err) => {
      console.error("Error during subtitle rendering:", err);
      res.status(500).send({
        message: "Error during subtitle rendering",
        error: err.message
      });
    })
    .run();
});

// Render Final Video
app.post('/api/videos/:id/render', async (req, res) => {
  const video = await prisma.video.findUnique({ where: { id: parseInt(req.params.id) } });

  if (!video) {
    return res.status(404).send({ message: 'Video not found' });
  }

  const output = `uploads/final-${Date.now()}.mp4`;

  console.log(`Rendering video...`);
  console.log(`Input Video Path: ${video.trimmedPath || video.path}`);
  console.log(`Output Path: ${output}`);

  // Run FFmpeg to render the final video
  ffmpeg(video.trimmedPath || video.path)
    .outputOptions('-c:v libx264 -crf 23')  // Set video quality options
    .output(output)
    .on('end', async () => {
      // Ensure that finalPath is updated in the database
      console.log("Rendering complete, updating database...");

      try {
        await prisma.video.update({
          where: { id: video.id },
          data: { finalPath: output, status: 'rendered' }
        });
        console.log("Database updated successfully");
        res.send({ message: 'Render complete', path: output });
      } catch (error) {
        console.error("Database update failed", error);
        res.status(500).send({ message: 'Error during final video rendering', error: error.message });
      }
    })
    .on('error', (err) => {
      console.error("FFmpeg Error: ", err.message);
      res.status(500).send({
        message: "Error during video rendering",
        error: err.message
      });
    })
    .run();
});

// Download Final Video
app.get('/api/videos/:id/download', async (req, res) => {
  const video = await prisma.video.findUnique({ where: { id: parseInt(req.params.id) } });

  if (!video) {
    return res.status(404).send({ message: 'Video not found' });
  }

  console.log(`Checking if final video exists for video ID: ${video.id}`);
  if (video.finalPath) {
    console.log(`Final video path: ${video.finalPath}`);
    res.download(video.finalPath);
  } else {
    console.error('Final video not found in the database.');
    res.status(404).send('Final video not found.');
  }
});

// Start Server
app.listen(5000, () => console.log('Server running on http://localhost:5000'));

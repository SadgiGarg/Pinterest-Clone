import 'dotenv/config';
import express from 'express';
import connectDB from './database/db.js';
import cookieParser from 'cookie-parser';
import path from 'path';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

connectDB();

import userRoutes from './routes/userRoutes.js';
import pinRoutes from './routes/pinRoutes.js';

app.use("/api/user", userRoutes);
app.use("/api/pin", pinRoutes);

const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "frontend/dist")));

// ✅ Fixed wildcard route - works with Express v4 and v5
app.use((req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
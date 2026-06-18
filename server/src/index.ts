
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import applicationRoutes from "./routes/applications";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
	origin: process.env.CLIENT_URL || "http://localhost:5173",
	credentials: true
}));

app.use(express.json());

app.get("/health", (req, res) => {
	res.json({ status: "Server is running!", timestamp: new Date().toISOString() });
});

app.use("/applications", applicationRoutes);

app.use((req, res) => {
	res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`✅ Server running on http://localhost:${PORT}`);
	console.log(`🏥 Health check: http://localhost:${PORT}/health`);
	console.log(`  DB Studio: run "npm run db:studio" to browse your data`);
});

export default app;

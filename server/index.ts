import * as express from "express";
import Redis from "ioredis";
const { v4: uuidv4 } = require("uuid");
import * as cors from "cors";

const app = express();
const PORT = 3000;

// Redis connection
const redis = new Redis();

redis.on("connect", () => {
  console.log("connected to Redis");
});

redis.on("error", (err) => {
  console.log("Redis connection error", err);
});

const corsOptions = {
  origin: "http://localhost:3001",
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));

app.get("/get-layout", async (req, res) => {
  // get user id from cookies
  let userId = req?.cookies?.userId || "";
  if (!userId) {
    userId = uuidv4();
    res.cookie("userId", userId, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
  }

  // get layout for the user from redis
  let layout = await redis.hget("user_layouts", userId);
  if (!layout) {
    // assign a new layout
    const layoutCounts = await Promise.all([
      redis.get("layout_1_count"),
      redis.get("layout_2_count"),
      redis.get("layout_3_count"),
    ]).then((counts) => counts.map((count) => (count ? parseInt(count) : 0)));

    // assign user to the layout with the minimum users
    const minAmount = Math.min(...layoutCounts);
    const layoutIndex = layoutCounts.indexOf(minAmount);
    const layoutName = `layout_${layoutIndex + 1}`;
    // update redis with layout and new user
    await Promise.all([
      redis.hset("user_layouts", userId, layoutName),
      redis.incr(`${layoutName}_count`),
    ]);

    layout = layoutName;
  }

  res.send({ layout });
});

app.listen(PORT, () => {
  console.log("Sever is running on port 3000");
});

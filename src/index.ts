import { connect } from "nats";
const NATS_URL = "nats://88.198.120.133:4222";
const SUBJECT = "orders";
import activityService from "models/activity/activity.service";
import express from "express";
import { connectDB } from "@config/DB.config";
import "dotenv/config";
const app = express();




async function runSubscriber() {
  let nc;
  try {
    nc = await connect({ servers: NATS_URL });
    console.log(`connect successfully to ${nc.getServer()}`);
    const subscription = nc.subscribe(SUBJECT);

    console.log(`i lesten to ${SUBJECT}`);
    for await (const msg of subscription) {
      const data = msg.data.toString();
      try {
        const order = JSON.parse(data);
        console.log(`new order has been received`);
        console.log(order);
        activityService.createOne(order);
      } catch (e) {
        console.error(e);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    if (nc) {
      await nc.close();
    }
  }
}

runSubscriber();

app.get("/log", async (req, res, next) => {
  const data = await activityService.getAll();
  console.log(data);
  res.send(data);
});

app.listen(process.env.port, async () => {
  await connectDB();
  console.log("server is running on port ${process.env.port}");
});

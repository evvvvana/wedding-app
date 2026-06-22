import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null };
}

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  cached.conn = await mongoose.connect(process.env.MONGODB_URI);
  return cached.conn;
};

const RSVP = mongoose.models.RSVP || mongoose.model("RSVP", {
  name: String,
  attendance: String,
  message: String,
});

export const handler = async (event) => {
  try {
    await connectDB();

    const body = JSON.parse(event.body);

    const newRSVP = await RSVP.create({
      name: body.name,
      attendance: body.attendance,
      message: body.message,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "RSVP saved", newRSVP }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};

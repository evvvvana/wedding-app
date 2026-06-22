import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null };
}

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  const uri = process.env.MONGODB_URI || 'mongodb+srv://hibasakhri4_db_user:Wbwsw6Mld9nkPvAS@cluster0.lml0cwu.mongodb.net/wedding';
  cached.conn = await mongoose.connect(uri);
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "RSVP saved", newRSVP }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: err.message }),
    };
  }
};

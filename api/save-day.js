import clientPromise from "../lib/MongoDB";


export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { date, breakfast, lunch, dinner } = req.body;

  if (!date || !breakfast || !lunch || !dinner) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("restaurant"); // DB name

    // Update or create today's document
    await db.collection("daily").updateOne(
      { date }, // find by date
      {
        $set: {
          breakfast,
          lunch,
          dinner,
          finalized: true // mark as final
        }
      },
      { upsert: true } // create if not exists
    );

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Mongo error:", err);
    return res.status(500).json({ error: "Database error" });
  }
}
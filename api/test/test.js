import clientPromise from "../../lib/MongoDB";

export default async function handler(req, res) {
    console.log("API HIT");

    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        console.log("Connecting to DB...");

        const client = await clientPromise;
        const db = client.db("meal-assessment");

        console.log("Connected!");

        const result = await db.collection("ratings").insertOne({
            ...req.body,
            createdAt: new Date()
        });

        return res.status(200).json({ message: "Data saved", id: result.insertedId });
    } catch (error) {
        console.error("FULL ERROR:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
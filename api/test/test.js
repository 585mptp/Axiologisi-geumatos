import clientPromise from "../../lib/MongoDB";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const client = await clientPromise;
        const db = client.db("meal-assessment");
        const collection = db.collection("ratings");

        const result = await collection.insertOne({
            ...req.body,
            createdAt: new Date()
        });

        return res.status(200).json({ message: "Data saved", id: result.insertedId });
    } catch (error) {
        console.error("Error inserting data:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
} 
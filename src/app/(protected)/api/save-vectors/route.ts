import connectToDatabase from "@/utils/rag/db";
import Vector from "@/utils/rag/vector_schema";
export default async function handler(req: any, res: any) {
  await connectToDatabase();

  if (req.method === "POST") {
    const { vector, metadata } = req.body;

    if (!vector || !Array.isArray(vector)) {
      return res.status(400).json({ message: "Vector must be an array" });
    }

    try {
      const newVector = new Vector({ vector, metadata });
      await newVector.save();
      res.status(201).json(newVector);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error storing vector" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "Missing image id" });
    }

    try {
        const imageRes = await fetch(
            `https://drive.google.com/thumbnail?id=${id}&sz=w1600`,
            {
                headers: {
                    // Use server-side API key — not exposed to browser
                    Authorization: `Bearer ${process.env.GOOGLE_SERVICE_TOKEN ?? ""}`,
                },
            }
        );

        if (!imageRes.ok) throw new Error("Failed to fetch image");

        const buffer = await imageRes.arrayBuffer();
        const contentType = imageRes.headers.get("content-type") || "image/jpeg";

        res.setHeader("Content-Type", contentType);
        res.setHeader("Cache-Control", "public, max-age=86400"); // cache 24h
        res.send(Buffer.from(buffer));
    } catch {
        res.status(500).json({ error: "Could not load image" });
    }
}
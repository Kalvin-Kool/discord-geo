export default async function handler(req, res) {
    const { id } = req.query;
    if (!id) return res.status(400).send("No ID provided");

    try {
        // 1. Ask Mapillary for the image URL
        const metaRes = await fetch(`https://graph.mapillary.com/${id}?fields=thumb_2048_url`, {
            headers: { 'Authorization': `OAuth ${process.env.MAPILLARY_TOKEN}` }
        });
        const meta = await metaRes.json();
        if (!meta.thumb_2048_url) throw new Error("Image not found");

        // 2. Vercel downloads the image securely
        const imgRes = await fetch(meta.thumb_2048_url);
        const arrayBuffer = await imgRes.arrayBuffer();

        // 3. Vercel serves the image directly to Discord!
        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.status(200).send(Buffer.from(arrayBuffer));
    } catch (error) {
        res.status(500).send("Failed to load image");
    }
}

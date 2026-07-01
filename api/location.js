export default async function handler(req, res) {
    const zones = [
        { name: "New York, USA", bbox: "-74.05,40.65,-73.90,40.80" },
        { name: "London, UK", bbox: "-0.25,51.40,0.10,51.60" },
        { name: "Paris, France", bbox: "2.20,48.80,2.45,48.95" },
        { name: "Tokyo, Japan", bbox: "139.50,35.50,139.90,35.80" },
        { name: "Sydney, Australia", bbox: "151.10,-33.95,151.30,-33.75" },
        { name: "Rome, Italy", bbox: "12.35,41.80,12.60,42.00" },
        { name: "Cape Town, South Africa", bbox: "18.35,-34.05,18.55,-33.85" },
        { name: "Rio de Janeiro, Brazil", bbox: "-43.35,-23.00,-43.10,-22.80" }
    ];

    const { mode, seed } = req.query;
    
    let randNum = Math.random();
    if (mode === 'daily' && seed) {
        let x = Math.sin(Number(seed)) * 10000;
        randNum = x - Math.floor(x);
    }
    const zone = zones[Math.floor(randNum * zones.length)];
    
    try {
        const url = `https://graph.mapillary.com/images?fields=id,geometry&bbox=${zone.bbox}&is_pano=true&limit=50`;
        const response = await fetch(url, { headers: { 'Authorization': `OAuth ${process.env.MAPILLARY_TOKEN}` } });
        const data = await response.json();
        if (!data.data || data.data.length === 0) throw new Error("No images");

        let imgRand = Math.random();
        if (mode === 'daily' && seed) {
            let y = Math.cos(Number(seed)) * 10000;
            imgRand = y - Math.floor(y);
        }
        const image = data.data[Math.floor(imgRand * data.data.length)];
        
        res.status(200).json({ id: image.id, lat: image.geometry.coordinates[1], lng: image.geometry.coordinates[0], name: zone.name });
    } catch (error) {
        res.status(500).json({ error: "Failed" });
    }
}

import express from "express";
import mongoose from "mongoose";
import Link from "./models/link.js";
import dotenv from "dotenv";
dotenv.config();
import path from "path";

const app = express();
app.use(express.json())

const __dirname = path.resolve();

const PORT = process.env.PORT || 5000;

const connectDb = async () => {
    const conn = await mongoose.connect(process.env.MONGODB_URI)

    if (conn) {
        console.log("mongodb connected sucessfully")
    }
}
connectDb();

app.post("/link", async (req, res) => {
    const { url, slug } = req.body;

    const randomSlug = Math.random().toString(36).substring(2, 7);
    const link = new Link({
        url: url,
        slug: slug || randomSlug
    })

    try {
        const savedLink = await link.save();

        return res.json({
            success: true,
            data: {
                shortUrl: `${process.env.BASE_URL}/${savedLink.slug}`
            },
            message: "link save succesfully..!"
        })
    } catch (e) {
        return res.json({
            success: true,
            message: e.message
        })
    }
})

app.get("/:slug", async (req, res) => {
    const { slug } = req.params;

    const link = await Link.findOne({ slug: slug });

    if (!link) {
        return res.json({
            success: false,
            message: "Link not found"
        })
    }

    await Link.updateOne({ slug: slug }, { $set: { clicks: link.clicks + 1 } })

    res.redirect(link.url);
})

app.get('/api/links', async (req, res) => {
    const links = await Link.find({});

    return res.json({
        success: true,
        data: links
    })
})

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'))
    })
}

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})
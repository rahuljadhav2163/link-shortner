import express from "express";
import mongoose from "mongoose";
import Link from "./models/link.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json())
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
             shortUrl : `${process.env.BASE_URL}/${savedLink.slug}`
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

app.get("/:slug" , async (req,res)=>{
    const {slug} = req.params;

    const link = await Link.findOne({slug:slug});

    await Link.updateOne({slug : slug},{$set:{clicks:link.clicks+1}})
    if(!link){
    return res.json({
        success : false,
        message : "Link not found"
    })
    }
    res.redirect(link.url);
} )

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})
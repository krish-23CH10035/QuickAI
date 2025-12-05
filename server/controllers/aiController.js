
import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import FormData from 'form-data';
import cloudinary from "../configs/cloudinary.js";
// pdf-parse is imported dynamically inside the handler to avoid ESM export issues
import { v2 as Cloudinary } from 'cloudinary';
import { createRequire } from 'module';

// Create a custom require function
const require = createRequire(import.meta.url);

// Import pdf-parse strictly as a CommonJS module
const pdfParse = require('pdf-parse'); 

// ... inside your resumeReview function ...
// const dataBuffer = fs.readFileSync(resume.path);
// const pdfData = await pdfParse(dataBuffer); // Note the name change to pdfParse





const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export const generateArticle = async(req, res) => {
    try {
        const { userId } = await req.auth();
        const { prompt, length } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if(plan !== 'premium' && free_usage >= 10){
            return res.json({ success: false, message: 'Free usage limit reached. Please upgrade to premium plan.' });
        }

        const response = await AI.chat.completions.create({
        model: "gemini-2.0-flash",
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
        temperature: 0.7,
        max_tokens: length,
    });

    const content = response.choices[0].message.content

    await sql` INSERT INTO creations(user_id, prompt, content, type) VALUES(${userId}, ${prompt}, ${content}, 'article')`;
    if(plan !== 'premium'){
        await clerkClient.users.updateUserMetadata(userId, {
            privateMetadata: {
                free_usage: free_usage + 1
            }
        })
    }

    res.json({ success: true, content });

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message });
    }
}

export const generateBlogTitle = async(req, res) => {
    try {
        const { userId } = await req.auth();
        const { prompt } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if(plan !== 'premium' && free_usage >= 10){
            return res.json({ success: false, message: 'Free usage limit reached. Please upgrade to premium plan.' });
        }

        const response = await AI.chat.completions.create({
        model: "gemini-2.0-flash",
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
        temperature: 0.7,
        max_tokens: 100,
    });

    const content = response.choices[0].message.content

    await sql` INSERT INTO creations(user_id, prompt, content, type) VALUES(${userId}, ${prompt}, ${content}, 'Blog-title')`;
    if(plan !== 'premium'){
        await clerkClient.users.updateUserMetadata(userId, {
            privateMetadata: {
                free_usage: free_usage + 1
            }
        })
    }

    res.json({ success: true, content });

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message });
    }
}

export const generateImage = async(req, res) => {
    try {
        const { userId } = await req.auth();
        const { prompt, publish } = req.body;
        const plan = req.plan;

        if(plan !== 'premium'){
            return res.json({ success: false, message: 'Free usage limit reached. Please upgrade to premium plan.' });
        }

    const formData = new FormData();
    formData.append('prompt', prompt);
    const {data} = await axios.post("https://clipdrop-api.co/text-to-image/v1", formData, {
        headers: {
            ...formData.getHeaders(),
            'x-api-key': process.env.CLICKDROP_API_KEY,
        }, responseType: 'arraybuffer',
    })

    const base64Image = `data:image/png;base64,${Buffer.from(data, 'binary').toString('base64')}`;

    const {secure_url} = await cloudinary.uploader.upload(base64Image)

    

    await sql` INSERT INTO creations(user_id, prompt, content, type, publish) 
    VALUES(${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})`;

    res.json({ success: true, content: secure_url });

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message });
    }
}

export const removeImageBackground = async(req, res) => {
    try {
        const { userId } = await req.auth();
        const image = req.file;
        const plan = req.plan;

        if(plan !== 'premium'){
            return res.json({ success: false, message: 'Free usage limit reached. Please upgrade to premium plan.' });
        }

    
    

        // Convert buffer to data URI for Cloudinary (memory storage)
        const dataUri = `data:${image.mimetype};base64,${image.buffer.toString('base64')}`;
        const {secure_url} = await cloudinary.uploader.upload(dataUri, {
        transformation: [
        {
            effect: 'background_removal',
            background_removal: 'remove_the_background'
        }
      ]
    })

    await sql` INSERT INTO creations(user_id, prompt, content, type)
    VALUES(${userId}, 'Remove background from image', ${secure_url}, 'image')`;

    res.json({ success: true, content: secure_url });

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message });
    }
}

export const removeImageObject = async(req, res) => {
    try {
        const { userId } = req.auth();
        const { object } = req.body;
        const image = req.file;
        const plan = req.plan;


        if(plan !== 'premium'){
            return res.json({ success: false, message: 'Free usage limit reached. Please upgrade to premium plan.' });
        }

    // Upload original image and request an AI-based object removal transformation.
    // Use `eager` to create a transformed version on upload and return its URL.
    // Convert buffer to data URI for Cloudinary (memory storage)
    const dataUri = `data:${image.mimetype};base64,${image.buffer.toString('base64')}`;
    const uploadResult = await cloudinary.uploader.upload(dataUri, {
        resource_type: 'image',
        eager: [
            {
                effect: `gen_remove:${object}`,
            },
        ],
    });

    // Prefer the eager transformed URL if available, otherwise fallback to secure_url
    const imageUrl = (uploadResult.eager && uploadResult.eager[0] && uploadResult.eager[0].secure_url) || uploadResult.secure_url;

    await sql` INSERT INTO creations(user_id, prompt, content, type)
    VALUES(${userId}, ${`Removed ${object} from image `}, ${imageUrl}, 'image')`;

    res.json({ success: true, content: imageUrl });

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message });
    }
}


export const resumeReview = async(req, res) => {
    try {
        const { userId } = req.auth();
        const resume = req.file;
        const plan = req.plan;


    if(plan !== 'premium'){
        return res.json({ success: false, message: 'Free usage limit reached. Please upgrade to premium plan.' });
    }

    if (resume.size > 5 * 1024 * 1024) {
        return res.json({ success: false, message: 'File size exceeds 5MB limit.' });
    }

    // With memory storage, file data is in buffer, not on disk
    const dataBuffer = resume.buffer;

    // Determine the correct parser function exported by `pdf-parse`.
    // The package can be exported in different shapes depending on bundler/interop.
    let pdfData;
    // Support v1 (callable function) and v2 (PDFParse class) shapes
    if (typeof pdfParse === 'function' || (pdfParse && typeof pdfParse.default === 'function') || (pdfParse && typeof pdfParse.parse === 'function')) {
        // old-style function API
        const fn = typeof pdfParse === 'function' ? pdfParse : (pdfParse.default ?? pdfParse.parse);
        try {
            pdfData = await fn(dataBuffer);
        } catch (parseErr) {
            console.error('Error while parsing PDF (function API):', parseErr);
            return res.json({ success: false, message: 'Server error while parsing PDF. See server logs.' });
        }
    } else if (pdfParse && typeof pdfParse.PDFParse === 'function') {
        // v2 class API
        const ParserClass = pdfParse.PDFParse;
        const parser = new ParserClass({ data: dataBuffer });
        try {
            // prefer getText to extract plain text
            const result = await parser.getText();
            pdfData = result;
        } catch (parseErr) {
            console.error('Error while parsing PDF (PDFParse class):', parseErr);
            return res.json({ success: false, message: 'Server error while parsing PDF. See server logs.' });
        } finally {
            try {
                await parser.destroy();
            } catch (destroyErr) {
                console.warn('Failed to destroy PDF parser instance:', destroyErr);
            }
        }
    } else {
        console.error('pdf-parse export is not a callable API. Export shape:', Object.prototype.toString.call(pdfParse), pdfParse);
        return res.json({ success: false, message: 'Server error: PDF parser not available.' });
    }

    // pdfData can be either an object with .text property (v1 API) or a string (v2 API)
    const resumeText = typeof pdfData === 'string' ? pdfData : pdfData.text || '';
    
    const prompt = `Review the following resume and provide constructive
    feedback on its strengths, weaknesses, and areas for improvement. Resume
    Content: \n\n${resumeText}`

    const response = await AI.chat.completions.create({
        model: "gemini-2.0-flash",
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
        temperature: 0.7,
        max_tokens: 1000,
    });

    const content = response.choices[0].message.content       
    
    await sql` INSERT INTO creations(user_id, prompt, content, type)
    VALUES(${userId}, 'Review the uploaded resume', ${content}, 'resume-review')`;

    res.json({ success: true, content });

    } catch (error) {
        console.error(error.message);
        // Return a generic message to the client but log full error on server
        res.json({ success: false, message: 'Server error while processing resume. See server logs.' });
    }
}


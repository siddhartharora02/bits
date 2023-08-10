require('dotenv').config();

// Imports dependencies and set up http server
const axios = require("axios");
const express = require('express');
const cheerio = require('cheerio');
const body_parser = require('body-parser');


const { saveFound, getLastFound}  = require("./utils/supabase");
const { sendTelegramMessage } = require("./utils/telegram");

const app = express().use(body_parser.json()); // creates express http server

const fetchPosts = async () => {
    const url = 'https://www.bitsadmission.com/'; // Replace with your URL
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);
    const bodyText = $('body').text();
    const cleanedText = bodyText.replace(/\s+/g, ' ').trim();
    const searchString = 'Click on the below links to check your latest assignment of Admissions in First Degree programmes (B.E., MSc, B. Pharm.) after Iteration-05.';
    return cleanedText.includes(searchString);
};


const sendRequest = async () => {

    const isDone = await getLastFound();

    if (isDone) return false;

    const found = await fetchPosts();
    
    if (found) {
        await sendTelegramMessage("Iteration 3 Results are out");
        await saveFound();
        return true
    }

    return false;
}

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening', process.env.PORT || 1337));

app.get('/main', async (req, res) =>{
    try {
        const response = await sendRequest(req, res);
        res.send(response);
    } catch (error) {
        await sendTelegramMessage("Bot is down");
    } finally {
        res.end();
    }
});

// health check endpoint
app.get("/health", async(req, res) => {
    res.send("OK");
});
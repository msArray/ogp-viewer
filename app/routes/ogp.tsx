import { LoaderFunction, json } from "@remix-run/node";
import * as cheerio from "cheerio";
import axios from "axios";
import redis from "redis";

const client = await redis.createClient()
    .on('error', err => console.log('Redis Client Error', err))
    .connect();

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url).searchParams.get("url");

    if (!url) {
        return json({ error: "URL is required" }, { status: 400 });
    }

    try {
        // Redisキャッシュを確認
        const cachedData = await client.get(url);
        if (cachedData) {
            return json(JSON.parse(cachedData), {
                headers: {
                    "X-Cache": "HIT",
                },
            });
        }

        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        const ogpData = {
            title: $('meta[property="og:title"]').attr("content") || $("title").text(),
            description: $('meta[property="og:description"]').attr("content") || "",
            image: $('meta[property="og:image"]').attr("content") || "",
            url: $('meta[property="og:url"]').attr("content") || url,
        };

        // Redisにキャッシュ
        await client.set(url, JSON.stringify(ogpData), {
            EX: 60 * 60 * 24, // 1日間
        });

        return json(ogpData, {
            headers: {
                "X-Cache": "MISS",
            },
        });
    } catch (error) {
        console.error("Failed to fetch OGP data:", error);
        return json({ error: "Failed to fetch OGP data" }, { status: 500 });
    }
};

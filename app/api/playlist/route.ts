import axios from "axios";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

const yt_key = process.env.YT_TOKEN

export async function POST( req: Request) {

    try {

        const playlist = await axios.post("https://www.googleapis.com/youtube/v3/playlists?part=id,snippet", {
            "snippet": {
                "title": randomUUID,
                "description": "..."
            }
        },
        {
            headers: { "Authorization": `Bearer ${yt_key}`}
        })

        return NextResponse.json(playlist.data)

    } catch(e: any) {

        return new NextResponse(e, { status: 500 })

    }
    
}
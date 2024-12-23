import { oauth2Client } from "@/lib/oauth2";
import prismadb from "@/lib/prismadb";
import axios from "axios";
import { v4 } from "uuid";
import { NextResponse } from "next/server";

export async function POST() {

    try {

        const token = await prismadb.token.findFirst({
            where: { id: 1 },
        })

        await oauth2Client.setCredentials({
            refresh_token: token?.refreshToken,
        })

        const newAcc = (await oauth2Client.getAccessToken()).token

        const playlist = await axios.post("https://www.googleapis.com/youtube/v3/playlists?part=id,snippet,status", {
            "snippet": {
                "title": v4(),
                "description": "...",
            },
            "status": {
                "privacyStatus": "public"
            }
        },
        {
            headers: { "Authorization": `Bearer ${newAcc}`}
        })

        return NextResponse.json(playlist.data)

    } catch(e: any) {

        return new NextResponse(e.response, { status: 500 })

    }
    
}
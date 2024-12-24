import { oauth2Client } from "@/lib/oauth2";
import Bottleneck from "bottleneck"
import prismadb from "@/lib/prismadb";
import axios from "axios";
import { v4 } from "uuid";
import { NextResponse } from "next/server";

const limiter = new Bottleneck({
    maxConcurrent: 1, // Apenas uma requisição ao mesmo tempo
    minTime: 1000, // Pelo menos 1 segundo entre requisições
});

export async function POST() {

    try {

        const token = await prismadb.token.findFirst({
            where: { id: 1 },
        })

        await oauth2Client.setCredentials({
            refresh_token: token?.refreshToken,
        })

        const newAcc = (await oauth2Client.getAccessToken()).token

        const req: any = await limiter.schedule(async () => await axios.post("https://www.googleapis.com/youtube/v3/playlists?part=id,snippet,status", {
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
        }))

        return NextResponse.json(req.data)

    } catch(e: any) {

        return new NextResponse(e+'', { status: 500 })

    }
    
}
import { oauth2Client } from "@/lib/oauth2";
import prismadb from "@/lib/prismadb";
import axios from "axios";
import { NextResponse } from "next/server";
import * as cheerio from 'cheerio';
import { chromium } from 'playwright-chromium';
import puppeteer from "puppeteer"
import * as playwrightLambda from 'playwright-aws-lambda';
import * as path from 'path';

export async function GET( req: Request ) {
    
    try {

        const url = new URL(req.url)
        const dataQuery: string = url.searchParams.get('data') || ''

        if(!dataQuery) return new NextResponse('Nenhum dado foi identificado na query', { status: 400})


        // const executablePath = path.resolve(process.cwd()+"/chromium/opera.exe")

        // const browser = await puppeteer.launch({
        //     executablePath,
        //     headless: true,
        //     args: ['--no-sandbox', '--disable-setuid-sandbox'],
        // });
        
        const jsonString = Buffer.from(dataQuery, 'base64').toString('utf-8')
        const albumData = JSON.parse(jsonString)

        const ids: any[] = []
    
        for( const song of albumData.data.songsName) {

            const searchQuery = `${albumData.data.artist} ${song}`;
            const fetch = await axios.get(`https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`)
            const html = fetch.data
    
            const jsonHtml = html.match(/var ytInitialData = ({.*?});<\/script>/)
    
            if (!jsonHtml || !jsonHtml[1]) return new NextResponse("Não foi possível obter dados da página", { status: 404})
    
            const ytInitialData = JSON.parse(jsonHtml[1])
    
            const firstVideo = ytInitialData.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents[0]?.itemSectionRenderer?.contents?.find(
              (item: any) => item.videoRenderer
            )?.videoRenderer
      
            if (!firstVideo) return new NextResponse('Nenhum vídeo encontrado', { status: 404 })
        
            // Extrair o ID do vídeo e formar o URL
            const videoUrl = `https://www.youtube.com/watch?v=${firstVideo.videoId}`
            const videoQuery = new URL(videoUrl)

            ids.push(videoQuery.searchParams.get('v'))

        }

        return NextResponse.json(ids)

    } catch {

        return new NextResponse('Erro interno', { status: 500})

    }

}

export async function POST( req: Request) {
    
    try {

        const body = await req.json()
        const {playlistId, songsId} = body

        if(!playlistId) return new NextResponse("ID de playlist inválido.", { status: 400 })
        if(!songsId) return new NextResponse("Os IDs das músicas não respeitam o formato esperado.", { status: 400 })

        const token = await prismadb.token.findFirst({
            where: { id: 1 },
        })

        await oauth2Client.setCredentials({
            refresh_token: token?.refreshToken,
        })

        const newAcc = (await oauth2Client.getAccessToken()).token

        for( const id of songsId.data ) {

            await axios.post("https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails,id,snippet,status", {
                    snippet: {
                        playlistId,
                        resourceId: {
                            kind: "youtube#video",
                            videoId: id
                        }
                    }
            },
            {
                headers: { "Authorization": `Bearer ${newAcc}` }
            })

        }
        
        return NextResponse.json({
            playlistUrl: `https://www.youtube.com/playlist?list=${playlistId}`
        })

    } catch {

        return new NextResponse('Erro interno', { status: 500})

    }

}

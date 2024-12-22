import { oauth2Client } from "@/lib/oauth2";
import prismadb from "@/lib/prismadb";
import axios from "axios";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET( req: Request ) {
    
    try {

        const url = new URL(req.url)
        const dataQuery: string = url.searchParams.get('data') || ''

        if(!dataQuery) return new NextResponse('Nenhum dado foi identificado na query', { status: 400})

        const browser = await puppeteer.launch()
        
        const jsonString = Buffer.from(dataQuery, 'base64').toString('utf-8')
        const albumData = JSON.parse(jsonString)

        const ids: any[] = []
        
        for( const song of albumData.data.songsName) {

            const page = await browser.newPage()
            
            const searchQuery = `${albumData.data.artist} ${song}`;
            const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
      
            // Navega até a página de resultados
            await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });
            await page.waitForSelector('ytd-video-renderer');
      
            // Coleta a URL do vídeo com maior relevância
            const videoUrl = await page.evaluate(() => {
              const videoElement = document.querySelector('ytd-video-renderer a#video-title');
              return videoElement ? (videoElement as HTMLAnchorElement).href : null;
            });

          if(!videoUrl) return new NextResponse("Nenhum vídeo encontrado")
           
            const videoQuery = new URL(videoUrl)

          ids.push(videoQuery.searchParams.get('v'))

          page.close()

        }

        await browser.close()

        return NextResponse.json(ids)

    } catch {

        return new NextResponse('Erro interno.', { status: 500})

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

        for( const id of songsId ) {

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

    } catch (e: any) {

        return new NextResponse(e, { status: 500})

    }

}

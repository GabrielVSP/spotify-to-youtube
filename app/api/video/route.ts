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
           
          ids.push(videoUrl)

          page.close()

        }

        await browser.close()

        return NextResponse.json(ids)

    } catch(e: any) {

        return new NextResponse(e, { status: 500})

    }

}
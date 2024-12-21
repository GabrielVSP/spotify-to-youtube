import axios from "axios";
import { NextResponse } from "next/server";

export async function GET( req: Request ) {
    
    try {

        

        const url = new URL(req.url)
        const dataQuery: string = url.searchParams.get('data') || ''

        const jsonString = Buffer.from(dataQuery, 'base64').toString('utf-8')
        const albumData = JSON.parse(jsonString)

        const ids: any[] = []
        let test

        for (const song of albumData.data.songsName) {
            const query = `${albumData.data.artist} ${song}`;
            const response = await axios.get(
              `https://www.googleapis.com/youtube/v3/search?key=${process.env.YT_API_KEY}&q=${query}&type=video&part=snippet`
            );
            ids.push(response.data);
          }
        
        // albumData.data.songsName.forEach( async (song: any) => {
            
        //     axios.get(`https://www.googleapis.com/youtube/v3/search?key=${process.env.YT_API_KEY}&q=${albumData.data.artist} ${song}&type=video&part=snippet`)
        //     .then((res) =>  ids.push(res.data))
           
        // })

        return NextResponse.json(ids)

    } catch(e: any) {

        return new NextResponse(e, { status: 500})

    }

}
import prismadb from "@/lib/prismadb"
import axios from "axios"
import { NextResponse } from "next/server"

const tokenKey = process.env.TOKEN_KEY

interface Track {
    name: string
}

export async function GET ( req: Request, { params }: { params: Promise<{ albumId: string}> }) {
 
    try {

        const {albumId} = await params

        if(!albumId) return new NextResponse("ID inválido.", { status: 400 })

        const token = await prismadb.token.findFirst({
            where: { id: 1 }
        })

        if(!token) {

            await axios.get(`${process.env.APP_URL}api/token`, {
                headers: {
                    "Authorization": tokenKey
                }
            })

            return new NextResponse("Por favor tente novamente", { status: 500})

        }

        try {

            const res = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
                headers: {
                    'Authorization': `Bearer ${token.value}`
                }
            })

            const trackNames: string[] = []

            res.data.tracks.items.map((track: Track) => {

                trackNames.push(track.name)

            })

            return NextResponse.json({
                albumName: res.data.name,
                songsName: trackNames,
                artist: res.data.artists[0].name
            })

        } catch(e: any) {
            await axios.get(`${process.env.APP_URL}api/token`, {
                headers: {
                    "Authorization": tokenKey
                }
            })
            return new NextResponse("Erro na requisição da API, verifique o ID e tente novamente", { status: e.status})
        }

       

    } catch {

        return new NextResponse('Erro interno.', { status: 500})

    }

}
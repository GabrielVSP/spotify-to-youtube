import prismadb from "@/lib/prismadb"
import axios from "axios"
import { NextResponse } from "next/server"
import { authUrl, oauth2Client } from "@/lib/oauth2"

const tokenKey = process.env.TOKEN_KEY
const clientId: string =  process.env.CLIENT_ID || ''
const clientSecret: string =  process.env.CLIENT_SECRET || ''

export async function GET(req: Request) {
    
    try {

        const authHeader = req.headers.get('Authorization')

        if(!authHeader || authHeader !== tokenKey) return new NextResponse("Chave de autorização inválida.", { status: 401 })

        const tokenEnt = await prismadb.token.findFirst({
            where: {id: 1}
        })

        let response

            try {

                response = await axios.post(
                    'https://accounts.spotify.com/api/token',
                    new URLSearchParams({
                        'grant_type': "client_credentials",
                        'client_id': clientId,
                        'client_secret': clientSecret,
                    }).toString(),
                    {
                        headers: { "Content-Type": "application/x-www-form-urlencoded"}
                    }
                )

            } catch (e: any){
                return new NextResponse("Erro interno.", { status: 500})
            }

        if(tokenEnt) {

            await prismadb.token.update({
                where: { id: 1 },
                data: {
                    value: response.data["access_token"]
                }
            })

            return NextResponse.json("Token atualizado com sucesso.")

        }

        await prismadb.token.create({
            data: {
                value: response.data["access_token"],
                accessToken: '',
                refreshToken: ''
            }
        })

        return NextResponse.json("Token atualizado com sucesso.")

    } catch(e: any) {

        return new NextResponse("Erro interno"+ e, { status: 500})

    }

}

export async function POST() {
    
    try {
          
        return NextResponse.json(authUrl)

    } catch(e: any) {

        return new NextResponse(e, { status: 500})

    }

}


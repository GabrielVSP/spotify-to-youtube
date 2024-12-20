import prismadb from "@/lib/prismadb"
import axios from "axios"
import { NextResponse } from "next/server"

const tokenKey = process.env.TOKEN_KEY
const clientId: string =  process.env.CLIENT_ID || ''
const clientSecret: string =  process.env.CLIENT_SECRET || ''

export async function GET(req: Request) {
    
    try {

        const authHeader = req.headers.get('Authorization')

        if(!authHeader || authHeader !== tokenKey) return new NextResponse("Chave de autorização inválida.", { status: 401 })

        const tokenEnt = await prismadb.token.findFirst()

        if(tokenEnt) {

            let response

            try {

                response = await axios.post(
                    'https://accounts.spotify.com/api/token',
                    new URLSearchParams({
                        'grant_type': "client_credentials",
                        'client_id': 'clientId',
                        'client_secret': clientSecret,
                    }).toString(),
                    {
                        headers: { "Content-Type": "application/x-www-form-urlencoded"}
                    }
                )

            } catch {
                return new NextResponse("Erro interno", { status: 500})
            }

            return NextResponse.json(response.data)

            return NextResponse.json("Token atualizado com sucesso.")

        }

    } catch {

        return new NextResponse("Erro interno", { status: 500})

    }

}

export async function POST() {
    
}
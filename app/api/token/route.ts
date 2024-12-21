import prismadb from "@/lib/prismadb"
import axios from "axios"
import { NextResponse } from "next/server"
import { google } from "googleapis"

const tokenKey = process.env.TOKEN_KEY
const clientId: string =  process.env.CLIENT_ID || ''
const clientSecret: string =  process.env.CLIENT_SECRET || ''

let oauth2Client = new google.auth.OAuth2(
    '813928477968-85ele61u44hn3ufcgl4d99m9rd0lfl7i.apps.googleusercontent.com',
    '813928477968-85ele61u44hn3ufcgl4d99m9rd0lfl7i.apps.googleusercontent.com',
    'http://localhost:3000/api/callback'
);

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
                value: response.data["access_token"]
            }
        })

        return NextResponse.json("Token atualizado com sucesso.")

    } catch(e: any) {

        return new NextResponse("Erro interno"+ e, { status: 500})

    }

}

export async function POST() {
    
    try {
          
          const url = oauth2Client.generateAuthUrl({
            // 'online' (default) or 'offline' (gets refresh_token)
            access_type: 'offline',
          
            // If you only need one scope, you can pass it as a string
            scope: 'https://www.googleapis.com/auth/youtube'
          });

        // const response = await axios.post(
        //     "https://accounts.google.com/o/oauth2/v2/auth",
        //     new URLSearchParams({
        //       grant_type: 'Authorization Code', 
        //       callback_url: 'http://localhost',
        //       auth_url: 'https://accounts.google.com/o/oauth2/v2/auth',
        //       access_token_url: 'https://oauth2.googleapis.com/token',
        //       client_id: '813928477968-85ele61u44hn3ufcgl4d99m9rd0lfl7i.apps.googleusercontent.com',
        //       client_secret: '813928477968-85ele61u44hn3ufcgl4d99m9rd0lfl7i.apps.googleusercontent.com',
        //       scope: 'https://www.googleapis.com/auth/youtube'
        //     }),        
        //   );

        return NextResponse.json(url)
        // return NextResponse.json(response.data)

    } catch(e: any) {

        return new NextResponse(e, { status: 500})

    }

}

export default oauth2Client
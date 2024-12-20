import prismadb from "@/lib/prismadb"
import axios from "axios"
import { NextResponse } from "next/server"

const tokenKey = process.env.TOKEN_KEY

export async function GET ( req: Request, { params }: { params: { albumId: string}}) {
 
    try {

        const token = await prismadb.token.findFirst()

        if(!token) {

            const res = axios.get('localhost:3000/api/token', {
                headers: {
                    "Authorization": tokenKey
                }
            })

            return NextResponse.json(res)

        }

    } catch {

        return new NextResponse("Erro interno", { status: 500})

    }

}
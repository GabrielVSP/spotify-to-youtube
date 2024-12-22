import { NextResponse } from "next/server";
import { oauth2Client } from "@/lib/oauth2";
import prismadb from "@/lib/prismadb";

export async function GET( req: Request ) {
    
    try {

        const url = new URL(req.url)

        const code: string = url.searchParams.get('code') || ''
        
        const { tokens }: any = await oauth2Client.getToken(code)
        oauth2Client.setCredentials(tokens)

        await prismadb.token.update({
            where: { id: 1},
            data: {
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token
            }
        })

        return NextResponse.json(tokens)

    } catch {
        return new NextResponse('Erro interno.', { status: 500})
    }

}
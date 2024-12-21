import { google } from "googleapis";
import { NextResponse } from "next/server";
import oauth2Client from "../token/route";

interface Tokios {
    access_token: string | null | undefined;
    refresh_token: string | null | undefined;
  }

export async function GET( req: Request ) {
    
    try {

        const url = new URL(req.url)
        const body = await req.body

        const code: string = url.searchParams.get('code') || ''

        let oauth2Client = new google.auth.OAuth2(
            '813928477968-85ele61u44hn3ufcgl4d99m9rd0lfl7i.apps.googleusercontent.com',
            '813928477968-85ele61u44hn3ufcgl4d99m9rd0lfl7i.apps.googleusercontent.com',
            'http://localhost:3000/api/callback'
        );

        

        // const { tokens }: any = await oauth2Client.getToken(code)
        return NextResponse.json(await oauth2Client.getToken(code))
        oauth2Client.setCredentials(tokens);

        return NextResponse.json(tokens)

    } catch(e: any) {
        return new NextResponse(e, { status: 500})
    }

}
import { NextResponse } from "next/server";

export async function GET( req: Request ) {
    
    try {

        const body = await req.json()

        return NextResponse.json(body)

    } catch(e: any) {

        return new NextResponse(e, { status: 500})

    }

}
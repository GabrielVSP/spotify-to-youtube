import { google } from "googleapis";
import prismadb from "./prismadb";

export const oauth2Client = new google.auth.OAuth2(
    process.env.YT_CLIENT_ID,
    process.env.YT_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_APP_URL}api/callback`
);

export const authUrl = oauth2Client.generateAuthUrl({
    
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/youtube'

});

oauth2Client.on('tokens', (tokens) => {
    if (tokens.refresh_token) {
      
        prismadb.token.update({
            where: { id: 1},
            data: {
                refreshToken: tokens.refresh_token,
                accessToken: tokens.access_token || ''
            }
        })
    }
});
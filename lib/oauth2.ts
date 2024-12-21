import { google } from "googleapis";

export const oauth2Client = new google.auth.OAuth2(
    '813928477968-85ele61u44hn3ufcgl4d99m9rd0lfl7i.apps.googleusercontent.com',
    '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',
    'http://localhost:3000/api/callback'
);

export const authUrl = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',
  
    // If you only need one scope, you can pass it as a string
    scope: 'https://www.googleapis.com/auth/youtube'
});


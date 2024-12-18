/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-process-env */
/* eslint-disable no-console */
import axios from 'axios';

// @ts-expect-error
import betterOpn from 'better-opn';
import { createServer } from 'http';

/**
 *  👉 Script: Retrieves Linkedin API token for local testing (LOCAL_LINKEDIN_API_TOKEN environment variable value)
 */

const CLIENT_ID = process.env.LOCAL_LINKEDIN_CLIENT_ID!;
const CLIENT_SECRET = process.env.LOCAL_LINKEDIN_CLIENT_SECRET!;
const SCOPE = 'r_dma_portability_3rd_party';
const REDIRECT_URI = 'http://localhost:3000/callback';

const startOAuthFlow = async (): Promise<void> => {
  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}`;
  console.log('👉 Opening LinkedIn OAuth URL...');
  await betterOpn(authUrl);
};

// Create a simple server to handle the LinkedIn redirect
createServer(async (req, res) => {
  if (req.url?.startsWith('/callback')) {
    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    const code = urlParams.get('code');

    console.log('🔑 Authorization Code:', code);

    if (!code) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Authorization code is missing.');
      return;
    }

    try {
      const tokenUrl = 'https://www.linkedin.com/oauth/v2/accessToken';
      const tokenUrlParams = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID!,
        client_secret: CLIENT_SECRET!
      }).toString();

      const response = await axios.post(tokenUrl, tokenUrlParams, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
      const accessToken = response.data.access_token;

      console.log('✅ Access Token:', accessToken);

      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(`Access Token: ${accessToken}\n\nYou can now close this window.`);
    } catch (error: unknown) {
      console.error('❌ Error exchanging code for token:', error);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Failed to get access token.');
    }
  }
}).listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
  startOAuthFlow().catch((error) => {
    console.error('❌ Error starting OAuth flow:', error);
  });
});

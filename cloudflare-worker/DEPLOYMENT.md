# Cloudflare Worker Deployment Guide

This guide will help you deploy the SAHClock Template Saver worker to Cloudflare.

## Prerequisites

1. A Cloudflare account (free tier works fine)
2. Your domain already added to Cloudflare (`savehempclock.com`)
3. A GitHub Personal Access Token with `repo` permissions

## Step 1: Create GitHub Personal Access Token

1. Go to GitHub Settings → Developer Settings → Personal Access Tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Name it: `SAHClock Template Worker`
4. Select scope: `repo` (Full control of private repositories)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again!)

## Step 2: Install Wrangler CLI (Optional but Recommended)

```bash
npm install -g wrangler
wrangler login
```

## Step 3: Deploy via Cloudflare Dashboard (Easiest Method)

### 3.1: Create the Worker

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **Workers & Pages** in the left sidebar
3. Click **Create Application**
4. Click **Create Worker**
5. Name it: `save-template`
6. Click **Deploy**

### 3.2: Add the Worker Code

1. After deployment, click **Edit Code**
2. Delete all the default code
3. Copy the entire contents of `save-template-worker.js`
4. Paste it into the editor
5. Click **Save and Deploy**

### 3.3: Configure Environment Variables

1. Go back to the Worker overview page
2. Click on **Settings** tab
3. Scroll to **Environment Variables**
4. Add the following variables:

| Variable Name | Value | Type |
|---------------|-------|------|
| `GITHUB_TOKEN` | Your Personal Access Token | Secret (encrypted) |
| `GITHUB_OWNER` | `meezymeek` | Text |
| `GITHUB_REPO` | `SAHClock` | Text |
| `EMAIL_WEBHOOK_URL` | (Optional) Leave empty for now | Text |

**Important:** Make sure to mark `GITHUB_TOKEN` as **Secret** (encrypted)!

### 3.4: Add Custom Domain (Recommended)

1. In Worker settings, go to **Triggers** tab
2. Click **Add Custom Domain**
3. Enter: `api.savehempclock.com`
4. Click **Add Custom Domain**
5. Cloudflare will automatically create the DNS record

## Step 4: Test the Worker

### Test with cURL:

```bash
curl -X POST https://api.savehempclock.com \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Template",
    "author": "Test User",
    "description": "Testing the API",
    "config": {
      "theme": "gray",
      "showTitle": true
    }
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Template saved successfully!",
  "templateId": "test-template-1234567890"
}
```

### Test from Browser Console:

1. Open https://savehempclock.com
2. Open browser DevTools (F12)
3. Go to Console tab
4. Paste and run:

```javascript
fetch('https://api.savehempclock.com', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Browser Test',
    author: 'Your Name',
    description: 'Testing from browser',
    config: { theme: 'dark', showTitle: true }
  })
})
.then(r => r.json())
.then(data => console.log('Success:', data))
.catch(err => console.error('Error:', err));
```

## Step 5: Alternative - Deploy via Wrangler CLI

If you prefer command-line deployment:

### 5.1: Create wrangler.toml

```toml
name = "save-template"
main = "save-template-worker.js"
compatibility_date = "2024-01-01"

[vars]
GITHUB_OWNER = "meezymeek"
GITHUB_REPO = "SAHClock"

# Secrets are set separately with: wrangler secret put GITHUB_TOKEN
```

### 5.2: Deploy

```bash
# Set the secret
wrangler secret put GITHUB_TOKEN
# Paste your GitHub PAT when prompted

# Deploy
wrangler deploy
```

### 5.3: Add Custom Domain

```bash
wrangler domains add api.savehempclock.com
```

## Troubleshooting

### Error: "Failed to fetch templates.json"
- Check that `GITHUB_TOKEN` has `repo` permissions
- Verify `GITHUB_OWNER` and `GITHUB_REPO` are correct
- Check token hasn't expired

### Error: "Failed to commit template"
- Token might not have write permissions
- Check if there's a merge conflict (someone else committed recently)
- Verify the repository name is correct

### Error: "CORS" in browser
- Make sure the worker is deployed and accessible
- Check that the custom domain DNS has propagated (can take a few minutes)
- Try accessing the worker URL directly in browser

### Worker not receiving requests
- Check the custom domain is set up correctly
- Verify DNS has propagated: `nslookup api.savehempclock.com`
- Check Cloudflare Worker logs in the dashboard

## Security Notes

1. **Never commit** your GitHub Personal Access Token to the repository
2. Always use **encrypted environment variables** in Cloudflare for sensitive data
3. The worker validates all incoming data before committing
4. CORS is set to `*` for simplicity - you can restrict this to your domain only if preferred:
   ```javascript
   'Access-Control-Allow-Origin': 'https://savehempclock.com'
   ```

## Monitoring

View worker analytics and logs:
1. Go to Cloudflare Dashboard → Workers & Pages
2. Click on your `save-template` worker
3. View real-time logs, request counts, and errors

## Cost

- **Free tier**: 100,000 requests/day
- **Paid tier**: $5/month for 10 million requests

For this use case, the free tier is more than sufficient!

## Next Steps

After successful deployment:
1. Update `widget-wizard.html` to call your worker API
2. Test the full flow from the widget wizard
3. Remove or keep the GitHub Actions workflow as a backup

## Support

If you encounter issues:
- Check [Cloudflare Workers docs](https://developers.cloudflare.com/workers/)
- View worker logs in the Cloudflare dashboard
- Check GitHub API status at [GitHub Status](https://www.githubstatus.com/)

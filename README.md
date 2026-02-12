# BOTS

A project deployed on Netlify with GitHub integration for continuous deployment.

## Netlify Setup Instructions

### Option 1: Deploy via Netlify Dashboard (Recommended)

1. Go to [Netlify](https://app.netlify.com/)
2. Click **"Add new site"** → **"Import an existing project"**
3. Select **GitHub** as your Git provider
4. Authorize Netlify to access your GitHub account
5. Select the `jordannassie/BOTS` repository
6. Configure build settings:
   - **Build command:** Leave empty (or add your build command if needed)
   - **Publish directory:** `public`
7. Click **"Deploy site"**

### Option 2: Deploy via Netlify CLI

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Initialize and link the project:
   ```bash
   netlify init
   ```

4. Deploy:
   ```bash
   netlify deploy --prod
   ```

## Project Structure

```
BOTS/
├── netlify.toml      # Netlify configuration
├── public/           # Static files to deploy
│   └── index.html    # Main landing page
└── README.md         # This file
```

## Configuration

The `netlify.toml` file contains:
- **Build settings** - Publish directory and build commands
- **Redirects** - SPA-style routing support
- **Headers** - Security headers and caching rules
- **Environment contexts** - Production/preview environment variables

## Continuous Deployment

Once connected to GitHub:
- Every push to `main` triggers a production deployment
- Pull requests get automatic deploy previews
- Branch deploys are available for testing

## Local Development

Run a local development server with Netlify Dev:

```bash
netlify dev
```

This simulates the Netlify environment locally on port 8888.

## Adding More Features

### Netlify Functions (Serverless)

Create a `netlify/functions` directory and add JavaScript/TypeScript files:

```javascript
// netlify/functions/hello.js
export const handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello from Netlify Functions!" })
  };
};
```

Access at: `/.netlify/functions/hello`

### Environment Variables

Add environment variables in Netlify Dashboard:
1. Go to **Site settings** → **Environment variables**
2. Add your variables (they'll be available during build)

## Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [netlify.toml Reference](https://docs.netlify.com/configure-builds/file-based-configuration/)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Deploy Previews](https://docs.netlify.com/site-deploys/deploy-previews/)

## License

MIT

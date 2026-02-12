# BOTS - AI Mission Control

A central command center for managing AI agents. Talk to one main orchestrator that intelligently routes your requests to specialized sub-agents.

## Features

- **Main Orchestrator Agent**: Central AI that understands your requests and delegates to specialists
- **Specialized Sub-Agents**:
  - **Programmer**: Code writing, debugging, software architecture
  - **Social Media**: Content creation, marketing strategies
  - **Web Developer**: Frontend, backend, full-stack development
- **Multi-Provider Support**: OpenAI, Claude (Anthropic), and Ollama (local LLMs)
- **Real-time Dashboard**: Live agent status, chat interface, metrics
- **Modern UI**: Dark theme, responsive design, smooth animations

## Project Structure

```
BOTS/
├── mission-control/          # Next.js Mission Control app
│   ├── src/
│   │   ├── app/             # Next.js App Router + API routes
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Core logic (agents, providers)
│   │   └── store/           # Zustand state management
│   ├── package.json
│   └── README.md            # Detailed documentation
├── public/                   # Static landing page
│   └── index.html
├── netlify.toml             # Netlify configuration
└── README.md                # This file
```

## Quick Start

### 1. Install Dependencies

```bash
cd mission-control
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Add your API keys to `.env.local`:

```env
OPENAI_API_KEY=sk-your-openai-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment

### Netlify (Recommended for Mission Control)

1. Go to [Netlify](https://app.netlify.com/)
2. Import the repository
3. Set build settings:
   - **Base directory**: `mission-control`
   - **Build command**: `npm run build`
   - **Publish directory**: `mission-control/.next`
4. Add environment variables in Netlify dashboard
5. Deploy!

### Vercel

```bash
cd mission-control
npx vercel
```

## Adding New Agents

Create a new agent by extending `BaseAgent`:

```typescript
// mission-control/src/lib/agents/my-agent.ts
import { BaseAgent } from './base';

export class MyAgent extends BaseAgent {
  constructor() {
    super({
      id: 'my_agent',
      name: 'My Custom Agent',
      description: 'What this agent does',
      systemPrompt: `Your agent's personality...`,
      provider: 'openai',
      capabilities: ['skill1', 'skill2'],
    });
  }
  
  canHandle(input: string): boolean {
    return input.toLowerCase().includes('my keyword');
  }
}
```

Register in `src/lib/agents/index.ts`.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand
- **LLM SDKs**: OpenAI, Anthropic
- **Icons**: Lucide React

## License

MIT

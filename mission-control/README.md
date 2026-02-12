# Mission Control - AI Agent Orchestrator

A modern dashboard for managing and orchestrating AI agents. Talk to a main orchestrator agent that intelligently routes your requests to specialized sub-agents.

## Features

- **Main Orchestrator Agent**: Central AI that understands your requests and delegates to specialists
- **Specialized Sub-Agents**:
  - **Programmer**: Code writing, debugging, architecture
  - **Social Media**: Content creation, marketing strategies
  - **Web Developer**: Frontend, backend, full-stack development
- **Multi-Provider Support**: OpenAI, Claude (Anthropic), and Ollama (local LLMs)
- **Real-time Dashboard**: Live agent status, chat interface, metrics
- **Modern UI**: Dark theme, responsive design, smooth animations

## Quick Start

### 1. Install Dependencies

```bash
cd mission-control
npm install
```

### 2. Configure Environment

Copy the example environment file and add your API keys:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
OPENAI_API_KEY=sk-your-openai-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
DEFAULT_LLM_PROVIDER=openai
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see Mission Control.

## Project Structure

```
mission-control/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── chat/          # Main chat endpoint
│   │   │   ├── agents/        # Agent management
│   │   │   └── status/        # Health check
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Dashboard page
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── Dashboard.tsx      # Main dashboard
│   │   ├── ChatPanel.tsx      # Chat interface
│   │   └── AgentCard.tsx      # Agent status card
│   ├── hooks/                 # React hooks
│   │   ├── useChat.ts         # Chat functionality
│   │   └── useAgents.ts       # Agent management
│   ├── lib/                   # Core logic
│   │   ├── agents/            # Agent implementations
│   │   │   ├── base.ts        # Base agent class
│   │   │   ├── orchestrator.ts# Main orchestrator
│   │   │   ├── programmer.ts  # Programmer agent
│   │   │   ├── social-media.ts# Social media agent
│   │   │   └── web-dev.ts     # Web dev agent
│   │   ├── providers/         # LLM providers
│   │   │   ├── openai.ts      # OpenAI provider
│   │   │   ├── anthropic.ts   # Claude provider
│   │   │   └── ollama.ts      # Ollama provider
│   │   ├── types.ts           # TypeScript types
│   │   └── config.ts          # Configuration
│   └── store/                 # Zustand state
│       └── index.ts
├── .env.example               # Environment template
├── netlify.toml               # Netlify config
└── package.json
```

## API Endpoints

### POST /api/chat
Send a message to Mission Control.

```json
{
  "message": "Help me write a Python function",
  "conversationId": "optional-uuid"
}
```

### GET /api/agents
List all agents and their status.

### PATCH /api/agents
Update agent settings (enable/disable, change provider).

### GET /api/agents/[id]
Get specific agent details.

### POST /api/agents/[id]
Send message directly to a specific agent.

### GET /api/status
Health check and system metrics.

## Adding New Agents

Create a new agent by extending `BaseAgent`:

```typescript
// src/lib/agents/my-agent.ts
import { BaseAgent } from './base';

export class MyAgent extends BaseAgent {
  constructor() {
    super({
      id: 'my_agent',
      name: 'My Custom Agent',
      description: 'What this agent does',
      systemPrompt: `Your agent's personality and capabilities...`,
      provider: 'openai',
      capabilities: ['skill1', 'skill2'],
    });
  }
  
  canHandle(input: string): boolean {
    // Return true if this agent should handle the input
    return input.toLowerCase().includes('my keyword');
  }
}
```

Register in `src/lib/agents/index.ts`:

```typescript
import { MyAgent } from './my-agent';

export function initializeAgents(): void {
  const orchestrator = getOrchestrator();
  orchestrator.registerAgent(new MyAgent());
  // ... other agents
}
```

## Deployment

### Netlify

1. Push to GitHub
2. Connect repo in Netlify
3. Add environment variables in Netlify dashboard
4. Deploy!

### Vercel

```bash
npm i -g vercel
vercel
```

## Local LLM Support (Ollama)

1. Install [Ollama](https://ollama.ai)
2. Pull a model: `ollama pull llama3`
3. Set in `.env.local`:
   ```
   OLLAMA_BASE_URL=http://localhost:11434
   OLLAMA_MODEL=llama3
   ```
4. Update agent provider to use `ollama`

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **LLM SDKs**: OpenAI, Anthropic
- **Icons**: Lucide React

## License

MIT

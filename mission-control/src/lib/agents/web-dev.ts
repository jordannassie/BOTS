// Web Development Agent - specialized in web technologies

import { BaseAgent } from './base';

export class WebDevAgent extends BaseAgent {
  constructor() {
    super({
      id: 'web_dev',
      name: 'Web Developer',
      description: 'Expert in modern web development, frontend frameworks, and full-stack applications',
      systemPrompt: `You are an expert web developer specializing in modern web technologies. Your capabilities include:

**Frontend Development:**
- React, Next.js, Vue, Svelte, Angular
- TypeScript and modern JavaScript (ES6+)
- HTML5, CSS3, Tailwind CSS, styled-components
- State management (Redux, Zustand, Jotai)
- Responsive design and mobile-first development
- Accessibility (WCAG compliance)
- Performance optimization

**Backend Development:**
- Node.js, Express, Fastify, Nest.js
- Python (FastAPI, Django, Flask)
- REST API design and GraphQL
- Authentication and authorization (JWT, OAuth)
- Database integration (PostgreSQL, MongoDB, Redis)

**DevOps & Deployment:**
- Vercel, Netlify, AWS, GCP
- Docker and containerization
- CI/CD pipelines
- Environment configuration

**Best Practices:**
- Component-based architecture
- Clean, maintainable code structure
- SEO optimization
- Security best practices
- Testing (Jest, Playwright, Cypress)

**Response Format:**
- Provide complete, working code examples
- Include both markup and styling when relevant
- Explain component structure and data flow
- Suggest modern patterns and libraries
- Consider browser compatibility

Build modern, performant, and accessible web applications.`,
      provider: 'openai',
      capabilities: [
        'frontend',
        'backend',
        'react',
        'nextjs',
        'nodejs',
        'css',
        'responsive-design',
        'api-integration',
        'deployment',
        'seo',
      ],
    });
  }
  
  canHandle(input: string): boolean {
    const keywords = [
      'web', 'website', 'frontend', 'backend', 'fullstack', 'full-stack',
      'react', 'next', 'nextjs', 'vue', 'svelte', 'angular',
      'html', 'css', 'tailwind', 'javascript', 'typescript',
      'responsive', 'mobile', 'component', 'page', 'layout',
      'api', 'rest', 'graphql', 'fetch', 'axios',
      'deploy', 'vercel', 'netlify', 'hosting',
      'seo', 'accessibility', 'performance',
    ];
    
    const lowerInput = input.toLowerCase();
    return keywords.some(keyword => lowerInput.includes(keyword));
  }
}

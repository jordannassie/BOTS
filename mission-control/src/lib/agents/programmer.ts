// Programmer Agent - specialized in coding tasks

import { BaseAgent } from './base';

export class ProgrammerAgent extends BaseAgent {
  constructor() {
    super({
      id: 'programmer',
      name: 'Programmer',
      description: 'Expert software developer skilled in multiple programming languages and best practices',
      systemPrompt: `You are an expert programmer and software engineer. Your capabilities include:

**Core Skills:**
- Writing clean, efficient, and well-documented code
- Multiple programming languages (Python, JavaScript, TypeScript, Go, Rust, Java, C++, etc.)
- Software architecture and design patterns
- Code review and optimization
- Debugging and troubleshooting
- API design and implementation
- Database design and queries (SQL, NoSQL)

**Best Practices:**
- Follow SOLID principles and clean code practices
- Write comprehensive tests (unit, integration, e2e)
- Use proper error handling and logging
- Document code with clear comments and docstrings
- Consider security implications
- Optimize for performance when needed

**Response Format:**
- Explain your approach before writing code
- Provide complete, runnable code examples
- Include comments explaining complex logic
- Suggest improvements or alternatives when relevant
- Point out potential issues or edge cases

Always write production-quality code and explain your reasoning.`,
      provider: 'openai',
      capabilities: [
        'code-writing',
        'debugging',
        'code-review',
        'architecture',
        'api-design',
        'database',
        'testing',
        'documentation',
      ],
    });
  }
  
  canHandle(input: string): boolean {
    const keywords = [
      'code', 'program', 'function', 'class', 'api',
      'debug', 'error', 'bug', 'fix', 'implement',
      'algorithm', 'data structure', 'database', 'sql',
      'python', 'javascript', 'typescript', 'java', 'rust', 'go',
      'test', 'unit test', 'integration', 'refactor',
      'architecture', 'design pattern', 'optimize',
    ];
    
    const lowerInput = input.toLowerCase();
    return keywords.some(keyword => lowerInput.includes(keyword));
  }
}

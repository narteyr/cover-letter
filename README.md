# AI Cover Letter Generator

> **Open Source | No Login Required | Privacy-First**

Generate professional, personalized cover letters using AI. Upload your resume, provide job details, and get a perfectly formatted cover letter in seconds.

## Features

- ✅ **Resume Parsing**: Automatically extract information from PDF/DOCX resumes using LangChain
- ✅ **AI-Powered Generation**: Uses OpenAI GPT-4 to create human-sounding, specific cover letters
- ✅ **No Authentication**: No login, no accounts, no backend database
- ✅ **Privacy-First**: Your API key and data never leave your browser
- ✅ **Professional Format**: Standard business letter format with proper structure
- ✅ **Download as HTML**: Get a nicely formatted HTML file ready to print or convert to PDF

## Tech Stack

- **Frontend**: Next.js 16 + React 19 + TypeScript
- **AI/ML**: OpenAI GPT-4, LangChain
- **Resume Parsing**: pdf-parse, mammoth (DOCX support)
- **Styling**: Tailwind CSS
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- OpenAI API Key ([Get one here](https://platform.openai.com/api-keys))

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

The app will run on `http://localhost:3001`

### Usage

1. **Enter your OpenAI API Key** (required for AI parsing and generation)
2. **Upload your resume** (PDF or DOCX format)
3. **Fill in job details**:
   - Company name, address, job title
   - Job description
   - Optional: Hiring manager name, company values, motivation
4. **Generate** and review your cover letter
5. **Download as HTML** file

## How It Works

### 1. Resume Parsing with LangChain

```typescript
// Extracts structured data from your resume
const parsed = await processResumeFile(file, apiKey);
// Returns: name, email, phone, achievements, skills, etc.
```

Uses LangChain's structured output parser with OpenAI to extract:
- Contact information (name, email, phone, address)
- Years of experience
- Key achievements with metrics
- Relevant skills
- Education

### 2. Cover Letter Generation

Uses the same professional prompt system as the main Internaly app:

- **No AI slop**: Banned phrases like "I am excited to apply", "passionate about", "dynamic", etc.
- **Specific and direct**: Opens with concrete results or observations
- **Achievement-based**: Every claim backed by real achievements
- **Professional format**: Proper business letter structure
- **Human voice**: Sounds like a real person, not a robot

### 3. Privacy & Security

- API key stored only in browser memory (not persisted)
- All processing happens client-side or via your own OpenAI account
- No data sent to any third-party servers except OpenAI
- No login, no tracking, no analytics

## Project Structure

```
cover-letter/
├── src/
│   ├── app/
│   │   ├── api/generate/      # Cover letter generation API
│   │   ├── page.tsx            # Main UI
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles
│   ├── lib/
│   │   └── resume-parser.ts    # LangChain resume parsing
│   └── components/             # Reusable components (if needed)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## API Routes

### `POST /api/generate`

Generate a cover letter from parsed resume data and job details.

**Request Body:**
```json
{
  "apiKey": "sk-...",
  "candidateName": "John Doe",
  "candidateEmail": "john@example.com",
  "topAchievements": "Increased revenue by 40%...",
  "relevantSkills": "JavaScript, React, Node.js",
  "companyName": "Acme Corp",
  "jobTitle": "Senior Engineer",
  "jobDescription": "We are looking for...",
  "hiringManagerName": "Jane Smith",
  "whyThisCompany": "I admire Acme's mission...",
  "whyThisRole": "This role aligns with..."
}
```

**Response:**
```json
{
  "html": "<div class=\"sender-block\">...</div>..."
}
```

## Environment Variables

No environment variables required! Users provide their own OpenAI API key in the UI.

For development/testing, you can optionally set:

```bash
# .env.local (optional, for testing only)
OPENAI_API_KEY=sk-...
```

**⚠️ Never commit API keys to version control!**

## Contributing

This is an open-source project. Contributions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - feel free to use this in your own projects!

## Roadmap

- [ ] Add more resume formats (txt, rtf)
- [ ] Support for multiple languages
- [ ] Export to PDF directly (no HTML intermediate)
- [ ] Templates for different industries
- [ ] Local LLM support (Ollama, LM Studio)
- [ ] Cover letter history (local storage)

## Credits

Built with ❤️ using:
- [Next.js](https://nextjs.org)
- [OpenAI](https://openai.com)
- [LangChain](https://js.langchain.com)
- [Tailwind CSS](https://tailwindcss.com)

## Support

If you find this useful, please ⭐ star the repo!

For issues or questions, please open a GitHub issue.

---

**Made by the Internaly team** • [View main app](https://github.com/internaly)

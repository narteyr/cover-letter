# Quick Start Guide

Get the AI Cover Letter Generator running in 3 minutes!

## 1. Install Dependencies

```bash
cd cover-letter
pnpm install
```

## 2. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

## 3. Get an OpenAI API Key

1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)

## 4. Use the App

1. **Paste your OpenAI API key** in the first field
2. **Upload your resume** (PDF or DOCX)
3. **Wait for AI parsing** (~10-15 seconds)
4. **Fill in job details**:
   - Company name
   - Job title
   - Job description (paste from job posting)
   - Optional: Hiring manager, why this company/role
5. **Click "Generate Cover Letter"**
6. **Review and download** as HTML

## Cost

- Resume parsing: ~$0.01 per resume (uses GPT-4o-mini)
- Cover letter generation: ~$0.02 per letter (uses GPT-4o-mini)

Total: **~$0.03 per cover letter**

## Tips

### For Best Results

1. **Use a detailed resume** with metrics and achievements
2. **Paste the full job description** for better matching
3. **Add "Why this company"** if you have specific reasons
4. **Include hiring manager name** if you know it (makes letter more personal)

### Common Issues

**"Failed to parse resume"**
- Make sure your resume is a valid PDF or DOCX file
- Check that your resume has enough text content
- Verify your OpenAI API key is correct

**"Invalid OpenAI API key"**
- Make sure you copied the full key (starts with `sk-`)
- Check for extra spaces at beginning/end
- Verify your OpenAI account has credits

**"Rate limit exceeded"**
- You've made too many requests too quickly
- Wait a minute and try again
- Consider upgrading your OpenAI plan

## Development

### Project Structure

```
src/
├── app/
│   ├── api/generate/route.ts    # Cover letter API
│   ├── page.tsx                  # Main UI
│   └── layout.tsx                # Layout
├── lib/
│   └── resume-parser.ts          # LangChain parsing
```

### Key Files

- `src/lib/resume-parser.ts` - Resume parsing logic with LangChain
- `src/app/api/generate/route.ts` - Cover letter generation with OpenAI
- `src/app/page.tsx` - Main UI with 3-step wizard

### Customization

**Change the AI model:**

Edit `src/lib/resume-parser.ts`:
```typescript
const model = new ChatOpenAI({
  modelName: "gpt-4o-mini", // Change to gpt-4, gpt-3.5-turbo, etc.
});
```

**Modify cover letter style:**

Edit `src/app/api/generate/route.ts` - the `buildCoverLetterPrompt` function contains all the instructions for the AI.

**Update UI theme:**

Edit `tailwind.config.ts` and `src/app/globals.css`.

## Deployment

### Vercel (Recommended)

```bash
pnpm build
vercel deploy
```

### Docker

```bash
docker build -t cover-letter-generator .
docker run -p 3001:3001 cover-letter-generator
```

### Static Export

```bash
# Add to next.config.ts:
# output: 'export'

pnpm build
# Deploy the 'out' folder to any static host
```

## Need Help?

- Check the [README.md](README.md) for full documentation
- Open an issue on GitHub
- Review the code comments in the source files

---

Happy cover letter writing! 🚀

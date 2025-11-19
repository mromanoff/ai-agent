# agents

## Setup

### 1. Install dependencies:

```bash
bun install
```

### 2. Configure environment variables:

Copy the example environment file:

```bash
cp .env.example .env
```

### 3. Get your OpenAI API key:

1. Go to [OpenAI's platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to [API keys](https://platform.openai.com/api-keys)
4. Click "Create new secret key"
5. Copy the key and paste it into your `.env` file:

```
OPENAI_API_KEY=your-api-key-here
```

**Note:** Keep your API key secure and never commit it to version control.

## Usage

To run:

```bash
bun run index.ts "your message here"
```

Example:

```bash
bun run index.ts "what is the weather in Las Vegas?"
```

---

This project was created using `bun init` in bun v1.0.20. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

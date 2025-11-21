# AI Agent - TODO & Improvement Roadmap

**Analysis Date:** 2025-11-21
**Codebase Assessment:** 6/10 - Educational/Demo Level
**Status:** Not production-ready

---

## P0 - CRITICAL (Fix Immediately)

### 🔴 Stability & Safety
- [ ] **Add iteration limit to agent loop** (`src/agent.ts:16`)
  - Current: `while(true)` with no exit condition
  - Risk: Infinite loops, API credit exhaustion
  - Fix: Add max iteration counter (e.g., 10-20 iterations)

- [ ] **Implement comprehensive error handling**
  - Add try/catch blocks to all async operations
  - Locations: `src/llm.ts:8`, `src/memory.ts:33`, `src/agent.ts`
  - Handle: API timeouts, network failures, invalid responses

- [ ] **Validate OPENAI_API_KEY on startup**
  - Check environment variable exists before running
  - Provide clear error message if missing
  - Location: `index.ts` or `src/ai.ts`

### 🔒 Security
- [ ] **Remove db.json from git history**
  - File contains conversation data and is tracked despite being in .gitignore
  - Run: `git rm --cached db.json` and force push
  - Add to .gitignore if not already present

- [ ] **Delete or implement systemPrompt.ts**
  - Current: 0 bytes, unused dead code
  - Decision: Remove file or add actual system prompt functionality

---

## P1 - HIGH (Fix Soon)

### 🧪 Testing
- [ ] **Add test framework**
  - Install Vitest (Bun-compatible)
  - Add test script to package.json
  - Create basic test structure

- [ ] **Write unit tests**
  - Test memory operations (add/get messages)
  - Test tool runner with mock tools
  - Test LLM schema conversion
  - Test UI formatting functions

- [ ] **Add integration tests**
  - Mock OpenAI API responses
  - Test complete agent loop
  - Test tool execution flow

### 🛡️ Input Validation
- [ ] **Add user input validation**
  - Check for non-empty strings in CLI arguments
  - Sanitize input before sending to API
  - Add length limits to prevent abuse

- [ ] **Wrap JSON.parse in error handling**
  - Location: `src/toolRunner.ts:5`
  - Validate tool arguments with Zod schemas
  - Provide meaningful error messages

### 🧹 Code Cleanup
- [ ] **Remove unused dependencies**
  - Delete `got` (HTTP client - not used)
  - Delete `terminal-image` (not used)
  - Clean up package.json

- [ ] **Fix weather tool implementation**
  - Add `location` parameter to Zod schema
  - Implement real weather API call (or document as demo)
  - Remove hardcoded "hot, 90deg" response
  - Use `got` dependency or remove it

### 📊 Memory Management
- [ ] **Implement token counting**
  - Track conversation history token usage
  - Prevent context window overflow (gpt-4o-mini: 128k tokens)

- [ ] **Add conversation pruning**
  - Implement sliding window or summarization
  - Keep recent messages + summary of older ones
  - Configuration for max history length

---

## P2 - MEDIUM (Improvements)

### 🎯 Features
- [ ] **Add streaming responses**
  - Use OpenAI streaming API
  - Update UI in real-time
  - Better user experience for long responses

- [ ] **Process all tool calls**
  - Current: Only processes `toolCall[0]` (`src/agent.ts:28`)
  - Fix: Loop through all tool_calls or document limitation

- [ ] **Add logging framework**
  - Replace console.log with proper logger
  - Log levels: debug, info, warn, error
  - Log to file for debugging

- [ ] **Create configuration system**
  - Move hardcoded values to config file
  - Model name, temperature, max iterations
  - Make configurable per user/environment

### 📚 Documentation
- [ ] **Add architecture documentation**
  - Create architecture diagram
  - Document ReAct loop implementation
  - Explain component interactions

- [ ] **Write tool development guide**
  - How to add custom tools
  - Zod schema examples
  - Tool implementation patterns

- [ ] **Add JSDoc comments**
  - Document all public functions
  - Add parameter descriptions
  - Include usage examples

- [ ] **Improve README**
  - Add troubleshooting section
  - Explain db.json persistence
  - Add more examples beyond weather
  - Document limitations

### 🔧 Code Quality
- [ ] **Add ESLint**
  - Install and configure ESLint
  - Add lint script to package.json
  - Fix any linting issues

- [ ] **Add pre-commit hooks**
  - Run Prettier on commit
  - Run tests before commit
  - Type-check before commit

---

## P3 - LOW (Nice to Have)

### 🏗️ Architecture
- [ ] **Abstract LLM provider interface**
  - Remove tight coupling to OpenAI
  - Support multiple providers (Anthropic, Cohere, etc.)
  - Make provider swappable via config

- [ ] **Add dependency injection**
  - Make components more testable
  - Reduce coupling between modules

### 🚀 DevOps
- [ ] **Add CI/CD pipeline**
  - GitHub Actions for automated testing
  - Run tests on PR
  - Type-check and lint on push

- [ ] **Add rate limiting**
  - Throttle API requests
  - Prevent hitting OpenAI rate limits
  - Add request queue

- [ ] **Improve package.json**
  - Add version number
  - Add repository field
  - Add license field
  - Add keywords

### 🎨 User Experience
- [ ] **Add CLI help command**
  - Show available commands
  - Display usage examples
  - Version information

- [ ] **Add conversation reset command**
  - Clear db.json
  - Start fresh conversation
  - Archive old conversations

- [ ] **Support multi-turn conversations**
  - Interactive mode (not just single question)
  - REPL-style interface
  - Exit command

---

## Known Issues

### Bugs
- Empty `systemPrompt.ts` file (0 bytes, unused)
- Only first tool call processed, rest ignored
- No error handling anywhere in codebase
- Mock weather tool returns hardcoded data
- Missing location parameter in weather schema

### Security Concerns
- db.json in repository (contains conversation data)
- No API key validation
- No input sanitization (prompt injection risk)
- Unvalidated JSON.parse (crash risk)

### Performance Issues
- Unbounded memory growth (all messages stored forever)
- Blocking UI during API calls
- File I/O on every message (db.json read/write)

---

## Current Statistics

- **Total LOC:** ~5,700 (mostly dependencies)
- **Core LOC:** ~100 (actual logic)
- **Test Coverage:** 0%
- **Dependencies:** 10 (2 unused)
- **TypeScript Errors:** 0 (fixed in commit 2256222)
- **Security Issues:** 4 identified
- **Code Comments:** Nearly none

---

## Recommendations

**For Production Use:**
1. Complete all P0 items (critical fixes)
2. Add comprehensive test coverage (P1)
3. Implement proper error handling and logging
4. Add monitoring and observability

**For Learning/Demo:**
- Current state is acceptable
- Focus on documentation improvements
- Add more example tools
- Create tutorial/walkthrough

**Quick Wins:**
1. Add max iteration limit (5 min)
2. Validate OPENAI_API_KEY (5 min)
3. Remove unused dependencies (2 min)
4. Delete systemPrompt.ts (1 min)
5. Add basic error handling (30 min)

---

## Recent Changes

**Commit 2256222:** "fix: resolve TypeScript errors in memory and toolRunner"
- Fixed unused parameter in `getDb()`
- Fixed function signature in `getWeather()`
- All TypeScript errors resolved ✓

---

## Next Steps

1. Start with P0 critical fixes
2. Add basic test infrastructure
3. Implement error handling
4. Improve documentation
5. Add real tool implementations

**Estimated Time to Production-Ready:** 2-3 weeks of focused development

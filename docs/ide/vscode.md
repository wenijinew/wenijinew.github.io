# VS Code

*Written: 2026-08-23*

## Overview

Visual Studio Code — Microsoft's free, open-source editor. Electron-based with rich extension ecosystem, built-in Git, debugging, and terminal.

| Aspect | Detail |
|--------|--------|
| Config | `settings.json` (JSON) |
| Extensions | Marketplace (50,000+) |
| Built on | Electron (Chromium + Node.js) |
| Languages | TypeScript (core), any via extensions |
| Platforms | Windows, macOS, Linux, Web |

---

## Essential Keybindings

### Navigation

| Key | Action |
|-----|--------|
| `Ctrl+P` | Quick open file |
| `Ctrl+Shift+P` | Command palette |
| `Ctrl+G` | Go to line |
| `Ctrl+Shift+O` | Go to symbol in file |
| `Ctrl+T` | Go to symbol in workspace |
| `F12` | Go to definition |
| `Alt+F12` | Peek definition |
| `Shift+F12` | Find references |
| `Ctrl+Tab` | Switch between open files |
| `Ctrl+B` | Toggle sidebar |
| `Ctrl+J` | Toggle terminal panel |

### Editing

| Key | Action |
|-----|--------|
| `Ctrl+D` | Select next occurrence |
| `Ctrl+Shift+L` | Select all occurrences |
| `Alt+Up/Down` | Move line up/down |
| `Shift+Alt+Up/Down` | Copy line up/down |
| `Ctrl+Shift+K` | Delete line |
| `Ctrl+/` | Toggle comment |
| `Ctrl+Shift+A` | Toggle block comment |
| `Ctrl+H` | Find and replace |
| `Ctrl+Shift+H` | Find and replace in files |
| `Ctrl+Space` | Trigger suggestions |
| `Ctrl+.` | Quick fix / code action |
| `F2` | Rename symbol |

### Multi-Cursor

| Key | Action |
|-----|--------|
| `Alt+Click` | Add cursor |
| `Ctrl+Alt+Up/Down` | Add cursor above/below |
| `Ctrl+D` | Select next match (add cursor) |
| `Ctrl+Shift+L` | Cursor at all matches |
| `Ctrl+U` | Undo last cursor |

---

## settings.json

```json
{
    // Editor
    "editor.fontSize": 14,
    "editor.fontFamily": "'JetBrains Mono', 'Fira Code', monospace",
    "editor.fontLigatures": true,
    "editor.tabSize": 4,
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.minimap.enabled": false,
    "editor.cursorBlinking": "smooth",
    "editor.cursorSmoothCaretAnimation": "on",
    "editor.smoothScrolling": true,
    "editor.bracketPairColorization.enabled": true,
    "editor.guides.bracketPairs": "active",
    "editor.inlineSuggest.enabled": true,
    "editor.stickyScroll.enabled": true,
    "editor.linkedEditing": true,

    // Terminal
    "terminal.integrated.fontSize": 13,
    "terminal.integrated.defaultProfile.linux": "zsh",

    // Files
    "files.autoSave": "afterDelay",
    "files.autoSaveDelay": 1000,
    "files.trimTrailingWhitespace": true,
    "files.insertFinalNewline": true,
    "files.exclude": {
        "**/__pycache__": true,
        "**/.git": true,
        "**/node_modules": true
    },

    // Workbench
    "workbench.colorTheme": "One Dark Pro",
    "workbench.iconTheme": "material-icon-theme",
    "workbench.startupEditor": "none",
    "workbench.editor.labelFormat": "short",

    // Git
    "git.autofetch": true,
    "git.confirmSync": false,
    "git.enableSmartCommit": true,

    // Language-specific
    "[python]": {
        "editor.defaultFormatter": "ms-python.black-formatter",
        "editor.tabSize": 4
    },
    "[typescript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode",
        "editor.tabSize": 2
    },
    "[markdown]": {
        "editor.wordWrap": "on",
        "editor.quickSuggestions": false
    }
}
```

---

## Must-Have Extensions

### Development

| Extension | Purpose |
|-----------|---------|
| GitHub Copilot | AI code completion |
| GitLens | Enhanced Git annotations |
| Error Lens | Inline error/warning display |
| Pretty TypeScript Errors | Readable TS errors |
| ESLint | JavaScript/TypeScript linting |
| Prettier | Code formatting |
| Python (Microsoft) | Python IntelliSense, debugging |
| Ruff | Fast Python linting |
| rust-analyzer | Rust language support |
| Docker | Docker file support + management |

### Productivity

| Extension | Purpose |
|-----------|---------|
| Vim (vscodevim) | Vim keybindings |
| Multiple Cursor Case Preserve | Case-aware multi-cursor replace |
| Path Intellisense | File path autocomplete |
| Todo Tree | Highlight and list TODO/FIXME |
| Bookmarks | Mark and navigate bookmarks |
| Project Manager | Switch between projects |

### UI

| Extension | Purpose |
|-----------|---------|
| One Dark Pro | Popular dark theme |
| Material Icon Theme | File/folder icons |
| indent-rainbow | Colorized indentation |
| Bracket Pair Colorizer | Colored matching brackets |

---

## Remote Development

```
VS Code supports editing on remote machines:

┌─────────────┐         SSH / Container / WSL         ┌──────────────┐
│  Local VS   │ ──────────────────────────────────── │  Remote      │
│  Code (UI)  │         Extensions run here →         │  File System │
└─────────────┘                                       └──────────────┘
```

| Extension | Target |
|-----------|--------|
| Remote - SSH | Any SSH-accessible machine |
| Remote - Containers (Dev Containers) | Docker containers |
| Remote - WSL | Windows Subsystem for Linux |
| Remote - Tunnels | Any machine via tunnel (no SSH needed) |
| GitHub Codespaces | Cloud-hosted dev environments |

---

## Debugging

### launch.json Example (Python)

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Python: Current File",
            "type": "debugpy",
            "request": "launch",
            "program": "${file}",
            "console": "integratedTerminal",
            "justMyCode": true
        },
        {
            "name": "Python: FastAPI",
            "type": "debugpy",
            "request": "launch",
            "module": "uvicorn",
            "args": ["main:app", "--reload"],
            "jinja": true
        }
    ]
}
```

### Debug Keybindings

| Key | Action |
|-----|--------|
| `F5` | Start/continue debugging |
| `F9` | Toggle breakpoint |
| `F10` | Step over |
| `F11` | Step into |
| `Shift+F11` | Step out |
| `Shift+F5` | Stop debugging |
| `Ctrl+Shift+F5` | Restart debugging |

---

## Tasks (tasks.json)

```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Run tests",
            "type": "shell",
            "command": "pytest",
            "args": ["-v", "--tb=short"],
            "group": { "kind": "test", "isDefault": true },
            "presentation": { "reveal": "always", "panel": "new" }
        },
        {
            "label": "Build",
            "type": "shell",
            "command": "make build",
            "group": { "kind": "build", "isDefault": true }
        }
    ]
}
```

---

## Workspace Settings

```
project/
├── .vscode/
│   ├── settings.json      # Project-specific settings (override user)
│   ├── launch.json        # Debug configurations
│   ├── tasks.json         # Build/test tasks
│   ├── extensions.json    # Recommended extensions for team
│   └── keybindings.json   # Project-specific keybindings (rare)
```

### extensions.json (Team Recommendations)

```json
{
    "recommendations": [
        "ms-python.python",
        "ms-python.black-formatter",
        "charliermarsh.ruff",
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "eamodio.gitlens"
    ]
}
```

---

## Tips

| Tip | How |
|-----|-----|
| Zen mode | `Ctrl+K Z` (distraction-free) |
| Side-by-side diff | Select 2 files → right-click → Compare |
| Emmet abbreviations | Type `div.container>ul>li*5` + Tab (HTML) |
| Snippets | `Ctrl+Shift+P` → "Configure Snippets" |
| Timeline view | Bottom of Explorer → file history |
| Sync settings | Sign in with GitHub/Microsoft |
| Portable mode | Create `data/` folder next to executable |
| Command line | `code .` (open folder), `code --diff a b` |

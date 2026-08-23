# IDE & Editors

Configuration guides for the editors and IDEs I use daily.

## Comparison

| | Emacs | Vim | Neovim | Spacemacs | SpaceVim | VS Code |
|---|---|---|---|---|---|---|
| **Type** | Editor/OS | Modal editor | Modern Vim fork | Emacs distro | Vim/Neovim distro | GUI IDE |
| **Config language** | Elisp | VimScript | Lua | Elisp | TOML | JSON |
| **Startup** | 1-3s | <100ms | <200ms | 2-5s | <500ms | 1-3s |
| **Memory** | 50-200 MB | 5-20 MB | 20-80 MB | 200-400 MB | 30-100 MB | 300-800 MB |
| **Learning curve** | Very steep | Steep | Steep | Medium | Medium | Easy |
| **Modal editing** | Optional (evil) | Native | Native | evil-mode | Native | Extension |
| **LSP** | lsp-mode/eglot | Plugin | Built-in | Via layer | Via layer | Built-in |
| **Best for** | Lisp/Org-mode power users | Speed, SSH, universal | Modern Vim + IDE | Emacs without config pain | Vim without config pain | Everyone else |

## Guides

- [:material-gnu: **Emacs**](emacs.md) — Keybindings, packages, Org-mode, LSP, starter config
- [:material-vim: **Vim**](vim.md) — Modes, motions, text objects, registers, macros, .vimrc
- [:material-file-code: **Neovim**](neovim.md) — Lua config, lazy.nvim, Telescope, Tree-sitter, LSP
- [:material-space-invaders: **Spacemacs**](spacemacs.md) — Layers, SPC commands, evil-mode
- [:material-rocket-launch: **SpaceVim**](spacevim.md) — TOML layers, key mappings, autocomplete
- [:material-microsoft-visual-studio-code: **VS Code**](vscode.md) — Extensions, settings.json, remote dev, debugging

## Which One to Choose?

| If you want... | Use |
|---------------|-----|
| Maximum speed + minimal resources | Vim |
| Modern Vim with IDE features | Neovim (LazyVim) |
| Emacs power, no config work | Spacemacs |
| Vim with mnemonic keys, no config | SpaceVim |
| Full IDE, minimal setup | VS Code |
| Org-mode + Lisp hacking | Emacs |
| Work over SSH | Vim or Neovim |
| Team standardization | VS Code |

# SpaceVim

*Written: 2026-08-23*

## Overview

SpaceVim — a community-driven Vim/Neovim distribution with a layer system inspired by Spacemacs, bringing mnemonic `SPC`-leader bindings to Vim.

| Aspect | Detail |
|--------|--------|
| Base | Vim 8+ or Neovim |
| Config | `~/.SpaceVim.d/init.toml` |
| Package system | Layers + custom plugins |
| Leader key | `SPC` (space bar) |
| Local leader | `,` (language-specific actions) |

---

## Installation

```bash
# Automatic installer
curl -sLf https://spacevim.org/install.sh | bash

# For Neovim specifically
curl -sLf https://spacevim.org/install.sh | bash -s -- --install neovim
```

---

## Configuration (init.toml)

```toml
# ~/.SpaceVim.d/init.toml

[options]
    colorscheme = "gruvbox"
    colorscheme_bg = "dark"
    statusline_separator = "arrow"
    buffer_index_type = 4
    enable_tabline_filetype_icon = true
    enable_statusline_mode = true
    filemanager = "nerdtree"
    bootstrap_before = "myconfig#before"
    bootstrap_after = "myconfig#after"
    relativenumber = true

# Layers
[[layers]]
    name = "autocomplete"
    auto_completion_return_key_behavior = "complete"
    auto_completion_tab_key_behavior = "smart"

[[layers]]
    name = "shell"
    default_position = "bottom"
    default_height = 30

[[layers]]
    name = "git"

[[layers]]
    name = "lsp"

[[layers]]
    name = "lang#python"

[[layers]]
    name = "lang#rust"

[[layers]]
    name = "lang#typescript"

[[layers]]
    name = "lang#markdown"

[[layers]]
    name = "format"

# Custom plugins
[[custom_plugins]]
    repo = "tpope/vim-surround"
    merged = false
```

---

## Key Bindings

### File & Buffer

| Key | Action |
|-----|--------|
| `SPC f f` | Find file |
| `SPC f s` | Save file |
| `SPC f S` | Save all |
| `SPC f r` | Recent files |
| `SPC f t` | Toggle file tree |
| `SPC b b` | Buffer list |
| `SPC b d` | Delete buffer |
| `SPC b n / p` | Next / previous buffer |
| `SPC 1-9` | Switch to buffer by index |

### Window

| Key | Action |
|-----|--------|
| `SPC w v` | Split vertical |
| `SPC w s` | Split horizontal |
| `SPC w d` | Close window |
| `SPC w h/j/k/l` | Navigate windows |
| `SPC w H/J/K/L` | Move windows |
| `SPC w =` | Equalize window sizes |

### Search & Project

| Key | Action |
|-----|--------|
| `SPC s s` | Search in buffer |
| `SPC s p` | Search in project |
| `SPC s f` | Search files by name |
| `SPC p f` | Find file in project |
| `SPC p p` | Switch project |
| `SPC p t` | Toggle file tree |

### Language (Local Leader `,`)

| Key | Action |
|-----|--------|
| `, g d` | Go to definition |
| `, g r` | Find references |
| `, r` | Rename |
| `, f` | Format file |
| `, e` | Show errors |
| `, d` | Show documentation |

### Git

| Key | Action |
|-----|--------|
| `SPC g s` | Git status |
| `SPC g c` | Git commit |
| `SPC g p` | Git push |
| `SPC g d` | Git diff |
| `SPC g b` | Git blame |

---

## Available Layers

| Category | Layers |
|----------|--------|
| Completion | `autocomplete`, `denite`, `unite` |
| Languages | `lang#python`, `lang#rust`, `lang#go`, `lang#java`, `lang#typescript`, `lang#c` |
| Tools | `git`, `shell`, `format`, `debug`, `test` |
| UI | `colorscheme`, `ui`, `treesitter` |
| Frameworks | `lang#vue`, `lang#react` |
| Integration | `lsp`, `ctags`, `tmux` |

---

## Custom Functions

```toml
# In init.toml
[options]
    bootstrap_before = "myconfig#before"
    bootstrap_after = "myconfig#after"
```

```vim
" ~/.SpaceVim.d/autoload/myconfig.vim

function! myconfig#before() abort
    " Settings applied before SpaceVim loads
    let g:mapleader = "\<Space>"
endfunction

function! myconfig#after() abort
    " Settings applied after SpaceVim loads
    set scrolloff=5
    set wrap

    " Custom mappings
    nnoremap <leader>ot :terminal<CR>
endfunction
```

---

## SpaceVim vs Other Distributions

| Aspect | SpaceVim | Spacemacs | LazyVim (Neovim) |
|--------|----------|-----------|-----------------|
| Base editor | Vim or Neovim | Emacs | Neovim only |
| Config format | TOML | Elisp | Lua |
| Layer system | Yes | Yes | Modules |
| Mnemonic keys | SPC-based | SPC-based | SPC-based |
| Startup time | Fast (< 500ms) | Slow (2-5s) | Very fast (< 200ms) |
| Customization | TOML + VimScript | Elisp | Lua |
| Ease of use | Easy (TOML) | Medium | Medium (need Lua) |
| IDE completeness | Good | Excellent | Excellent |

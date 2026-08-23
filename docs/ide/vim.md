# Vim

*Written: 2026-08-23*

## Overview

Vim — the ubiquitous modal text editor. Available on virtually every Unix system, designed for speed through modal editing and composable commands.

| Aspect | Detail |
|--------|--------|
| Config | `~/.vimrc` |
| Plugin managers | vim-plug, Vundle, pathogen |
| Philosophy | "Edit at the speed of thought" |
| Modes | Normal, Insert, Visual, Command-line |

---

## Modal Editing

| Mode | Enter | Purpose |
|------|-------|---------|
| Normal | `Esc` | Navigate, compose commands |
| Insert | `i`, `a`, `o`, `I`, `A`, `O` | Type text |
| Visual | `v`, `V`, `Ctrl-v` | Select text (char, line, block) |
| Command-line | `:` | Ex commands, search, substitution |
| Replace | `R` | Overwrite characters |

---

## Motion Commands

### Character & Word

| Motion | Movement |
|--------|----------|
| `h / j / k / l` | Left / down / up / right |
| `w / W` | Next word start (word / WORD) |
| `b / B` | Previous word start |
| `e / E` | End of word |
| `0` / `^` / `$` | Line start / first non-blank / line end |
| `f{c}` / `F{c}` | Find char forward / backward |
| `t{c}` / `T{c}` | Till (before) char forward / backward |
| `;` / `,` | Repeat last f/F/t/T forward / backward |

### Line & Screen

| Motion | Movement |
|--------|----------|
| `gg` / `G` | File start / file end |
| `{n}G` or `:{n}` | Go to line n |
| `H / M / L` | Screen top / middle / bottom |
| `Ctrl-d / Ctrl-u` | Half-page down / up |
| `Ctrl-f / Ctrl-b` | Full page down / up |
| `%` | Matching bracket |
| `{` / `}` | Previous / next paragraph |

---

## Operators (Verb + Motion = Action)

```
Operators: d(elete), c(hange), y(ank), v(isual select), > (indent), < (dedent), g~(toggle case)

Operator + Motion:
    dw   → delete word
    d$   → delete to end of line
    ci"  → change inside quotes
    yap  → yank a paragraph
    >}   → indent to next paragraph
    gUiw → uppercase inner word

Operator + Text Object:
    diw  → delete inner word
    da{  → delete around braces (including braces)
    ci(  → change inside parentheses
    yit  → yank inner HTML tag
```

### Text Objects

| Object | Inner (`i`) | Around (`a`) |
|--------|-------------|--------------|
| `w` | word | word + surrounding space |
| `s` | sentence | sentence + space |
| `p` | paragraph | paragraph + blank lines |
| `"` `'` `` ` `` | inside quotes | quotes + quotes themselves |
| `(` `)` `b` | inside parens | parens included |
| `{` `}` `B` | inside braces | braces included |
| `[` `]` | inside brackets | brackets included |
| `t` | inside HTML tag | tag included |

---

## Registers

| Register | Purpose |
|----------|---------|
| `""` | Default (last delete/yank) |
| `"0` | Last yank (not affected by delete) |
| `"a`-`"z` | Named registers |
| `"A`-`"Z` | Append to named register |
| `"+` | System clipboard |
| `"*` | Primary selection (X11) |
| `"/` | Last search pattern |
| `".` | Last inserted text |
| `":` | Last command |
| `"_` | Black hole (discard) |

Usage: `"ayy` (yank line into register a), `"ap` (paste from register a)

---

## Macros

```
Record: q{register}  →  perform actions  →  q (stop recording)
Play:   @{register}
Repeat: @@  or  {n}@{register}

Example — add semicolons to multiple lines:
    qa        → start recording into register a
    A;        → append semicolon at end
    j         → move down
    q         → stop recording
    10@a      → replay 10 times
```

---

## Search & Substitute

```
/pattern          → search forward
?pattern          → search backward
n / N             → next / previous match
*                 → search word under cursor forward
#                 → search word under cursor backward

:s/old/new/       → substitute first on current line
:s/old/new/g      → substitute all on current line
:%s/old/new/g     → substitute all in file
:%s/old/new/gc    → substitute with confirmation
:'<,'>s/old/new/g → substitute in visual selection
```

---

## Essential .vimrc

```vim
" ~/.vimrc — Modern Vim configuration

set nocompatible
filetype plugin indent on
syntax on

" UI
set number relativenumber
set cursorline
set signcolumn=yes
set termguicolors
set scrolloff=8
set sidescrolloff=8

" Indentation
set tabstop=4
set shiftwidth=4
set expandtab
set smartindent
set autoindent

" Search
set ignorecase
set smartcase
set incsearch
set hlsearch

" Performance
set lazyredraw
set updatetime=300
set timeoutlen=500

" Files
set nobackup
set noswapfile
set undofile
set undodir=~/.vim/undodir

" Splits
set splitbelow
set splitright

" Leader key
let mapleader = " "

" Quality of life
nnoremap <leader>w :w<CR>
nnoremap <leader>q :q<CR>
nnoremap <Esc> :noh<CR>
nnoremap <leader>v :vsplit<CR>
nnoremap <C-h> <C-w>h
nnoremap <C-j> <C-w>j
nnoremap <C-k> <C-w>k
nnoremap <C-l> <C-w>l

" Clipboard
set clipboard=unnamedplus
```

---

## Plugin Management (vim-plug)

```vim
" Install vim-plug
" curl -fLo ~/.vim/autoload/plug.vim --create-dirs \
"   https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim

call plug#begin('~/.vim/plugged')

Plug 'tpope/vim-fugitive'        " Git
Plug 'tpope/vim-surround'        " Surround text objects
Plug 'tpope/vim-commentary'      " Comment with gc
Plug 'junegunn/fzf.vim'          " Fuzzy finder
Plug 'preservim/nerdtree'        " File tree
Plug 'airblade/vim-gitgutter'    " Git diff in gutter
Plug 'dense-analysis/ale'        " Linting
Plug 'morhetz/gruvbox'           " Colorscheme

call plug#end()

colorscheme gruvbox
set background=dark
```

---

## Vim Tips

| Tip | Command |
|-----|---------|
| Repeat last change | `.` |
| Increment/decrement number | `Ctrl-a` / `Ctrl-x` |
| Auto-indent file | `gg=G` |
| Sort lines | `:sort` |
| Remove trailing whitespace | `:%s/\s\+$//e` |
| Open terminal | `:terminal` |
| Record to register | `q{a-z}...q` then `@{a-z}` |
| Column editing | `Ctrl-v` → select → `I` → type → `Esc` |
| Spell check | `:set spell` then `]s`/`[s`/`z=` |

# Neovim

*Written: 2026-08-23*

## Overview

Neovim — a modern fork of Vim with first-class Lua scripting, built-in LSP, Tree-sitter, and an async architecture.

| Aspect | Detail |
|--------|--------|
| Config | `~/.config/nvim/init.lua` |
| Plugin manager | lazy.nvim (standard), packer.nvim (legacy) |
| Language | Lua (primary), VimScript (compatible) |
| LSP | Built-in client (nvim-lspconfig) |
| Tree-sitter | Built-in (syntax highlighting, text objects) |

---

## Directory Structure

```
~/.config/nvim/
├── init.lua                  # Entry point
├── lua/
│   ├── config/
│   │   ├── lazy.lua          # Plugin manager setup
│   │   ├── keymaps.lua       # Key mappings
│   │   ├── options.lua       # Vim options
│   │   └── autocmds.lua      # Autocommands
│   └── plugins/
│       ├── lsp.lua           # LSP configuration
│       ├── telescope.lua     # Fuzzy finder
│       ├── treesitter.lua    # Syntax
│       ├── cmp.lua           # Completion
│       └── ui.lua            # Theme, statusline
```

---

## Core Configuration

### init.lua

```lua
-- Entry point
require("config.options")
require("config.keymaps")
require("config.lazy")
require("config.autocmds")
```

### Options

```lua
-- lua/config/options.lua
local opt = vim.opt

opt.number = true
opt.relativenumber = true
opt.cursorline = true
opt.signcolumn = "yes"
opt.termguicolors = true
opt.scrolloff = 8
opt.sidescrolloff = 8

opt.tabstop = 4
opt.shiftwidth = 4
opt.expandtab = true
opt.smartindent = true

opt.ignorecase = true
opt.smartcase = true

opt.splitbelow = true
opt.splitright = true

opt.undofile = true
opt.swapfile = false
opt.backup = false

opt.updatetime = 250
opt.timeoutlen = 300
opt.clipboard = "unnamedplus"
```

### Keymaps

```lua
-- lua/config/keymaps.lua
vim.g.mapleader = " "
local map = vim.keymap.set

-- File operations
map("n", "<leader>w", "<cmd>w<cr>", { desc = "Save" })
map("n", "<leader>q", "<cmd>q<cr>", { desc = "Quit" })

-- Window navigation
map("n", "<C-h>", "<C-w>h", { desc = "Window left" })
map("n", "<C-j>", "<C-w>j", { desc = "Window down" })
map("n", "<C-k>", "<C-w>k", { desc = "Window up" })
map("n", "<C-l>", "<C-w>l", { desc = "Window right" })

-- Buffer navigation
map("n", "<S-l>", "<cmd>bnext<cr>", { desc = "Next buffer" })
map("n", "<S-h>", "<cmd>bprev<cr>", { desc = "Prev buffer" })
map("n", "<leader>bd", "<cmd>bdelete<cr>", { desc = "Delete buffer" })

-- Clear search highlight
map("n", "<Esc>", "<cmd>noh<cr>", { desc = "Clear highlight" })

-- Move lines
map("v", "J", ":m '>+1<cr>gv=gv", { desc = "Move line down" })
map("v", "K", ":m '<-2<cr>gv=gv", { desc = "Move line up" })

-- Better paste (don't overwrite register)
map("x", "<leader>p", '"_dP', { desc = "Paste without yank" })
```

---

## Plugin Manager (lazy.nvim)

```lua
-- lua/config/lazy.lua
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not vim.loop.fs_stat(lazypath) then
    vim.fn.system({
        "git", "clone", "--filter=blob:none",
        "https://github.com/folke/lazy.nvim.git",
        "--branch=stable", lazypath,
    })
end
vim.opt.rtp:prepend(lazypath)

require("lazy").setup("plugins", {
    install = { colorscheme = { "catppuccin" } },
    checker = { enabled = true, notify = false },
    change_detection = { notify = false },
})
```

---

## Key Plugins

### Telescope (Fuzzy Finder)

```lua
-- lua/plugins/telescope.lua
return {
    "nvim-telescope/telescope.nvim",
    dependencies = { "nvim-lua/plenary.nvim" },
    keys = {
        { "<leader>ff", "<cmd>Telescope find_files<cr>", desc = "Find files" },
        { "<leader>fg", "<cmd>Telescope live_grep<cr>", desc = "Grep" },
        { "<leader>fb", "<cmd>Telescope buffers<cr>", desc = "Buffers" },
        { "<leader>fh", "<cmd>Telescope help_tags<cr>", desc = "Help" },
        { "<leader>fr", "<cmd>Telescope oldfiles<cr>", desc = "Recent files" },
    },
}
```

### Tree-sitter

```lua
-- lua/plugins/treesitter.lua
return {
    "nvim-treesitter/nvim-treesitter",
    build = ":TSUpdate",
    config = function()
        require("nvim-treesitter.configs").setup({
            ensure_installed = {
                "lua", "python", "rust", "typescript",
                "javascript", "bash", "json", "yaml", "markdown",
            },
            highlight = { enable = true },
            indent = { enable = true },
            incremental_selection = { enable = true },
        })
    end,
}
```

### LSP

```lua
-- lua/plugins/lsp.lua
return {
    "neovim/nvim-lspconfig",
    dependencies = {
        "williamboman/mason.nvim",
        "williamboman/mason-lspconfig.nvim",
    },
    config = function()
        require("mason").setup()
        require("mason-lspconfig").setup({
            ensure_installed = { "lua_ls", "pyright", "rust_analyzer", "ts_ls" },
        })

        local lspconfig = require("lspconfig")
        local on_attach = function(_, bufnr)
            local map = function(keys, func, desc)
                vim.keymap.set("n", keys, func, { buffer = bufnr, desc = desc })
            end
            map("gd", vim.lsp.buf.definition, "Go to definition")
            map("gr", vim.lsp.buf.references, "References")
            map("K", vim.lsp.buf.hover, "Hover")
            map("<leader>rn", vim.lsp.buf.rename, "Rename")
            map("<leader>ca", vim.lsp.buf.code_action, "Code action")
        end

        local servers = { "lua_ls", "pyright", "rust_analyzer", "ts_ls" }
        for _, server in ipairs(servers) do
            lspconfig[server].setup({ on_attach = on_attach })
        end
    end,
}
```

### Completion (nvim-cmp)

```lua
-- lua/plugins/cmp.lua
return {
    "hrsh7th/nvim-cmp",
    dependencies = {
        "hrsh7th/cmp-nvim-lsp",
        "hrsh7th/cmp-buffer",
        "hrsh7th/cmp-path",
        "L3MON4D3/LuaSnip",
        "saadparwaiz1/cmp_luasnip",
    },
    config = function()
        local cmp = require("cmp")
        local luasnip = require("luasnip")

        cmp.setup({
            snippet = {
                expand = function(args) luasnip.lsp_expand(args.body) end,
            },
            mapping = cmp.mapping.preset.insert({
                ["<C-Space>"] = cmp.mapping.complete(),
                ["<CR>"] = cmp.mapping.confirm({ select = true }),
                ["<Tab>"] = cmp.mapping.select_next_item(),
                ["<S-Tab>"] = cmp.mapping.select_prev_item(),
            }),
            sources = cmp.config.sources({
                { name = "nvim_lsp" },
                { name = "luasnip" },
                { name = "buffer" },
                { name = "path" },
            }),
        })
    end,
}
```

---

## Neovim-Specific Features

| Feature | Vim | Neovim |
|---------|-----|--------|
| Configuration | VimScript | Lua (first-class) |
| LSP | Plugin required | Built-in client |
| Tree-sitter | No | Built-in |
| Async | Limited | Full async/coroutine |
| Terminal | Basic `:terminal` | Better terminal with floating windows |
| Remote plugins | No | Via RPC (any language) |
| UI | Fixed | Decoupled (external UIs possible) |
| Startup | Moderate | Fast (lazy loading) |

---

## Popular Distributions

| Distribution | Focus | Setup |
|-------------|-------|-------|
| LazyVim | Full IDE, batteries-included | `git clone` + open nvim |
| NvChad | Beautiful UI, fast | Template-based |
| AstroNvim | Community plugins | Modular layers |
| LunarVim | Opinionated IDE | Installer script |
| kickstart.nvim | Minimal, educational | Single-file starting point |

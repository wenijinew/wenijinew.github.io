# Spacemacs

*Written: 2026-08-23*

## Overview

Spacemacs — an Emacs distribution combining the best of Emacs and Vim. Mnemonic key bindings organized by `SPC` leader key, with a curated layer system.

| Aspect | Detail |
|--------|--------|
| Base | GNU Emacs |
| Editing style | Vim (evil-mode) or Emacs |
| Config | `~/.spacemacs` or `~/.spacemacs.d/init.el` |
| Package system | Layers (curated bundles of packages) |
| Leader key | `SPC` (Vim mode) or `M-m` (Emacs mode) |

---

## Installation

```bash
# Backup existing Emacs config
mv ~/.emacs.d ~/.emacs.d.bak

# Clone Spacemacs
git clone https://github.com/syl20bnr/spacemacs ~/.emacs.d

# Launch Emacs — Spacemacs wizard runs on first start
emacs
```

---

## Key Bindings (SPC Leader)

### Most Used

| Key | Action |
|-----|--------|
| `SPC f f` | Find file |
| `SPC f s` | Save file |
| `SPC f r` | Recent files |
| `SPC b b` | Switch buffer |
| `SPC b d` | Kill buffer |
| `SPC w /` | Split window vertically |
| `SPC w -` | Split window horizontally |
| `SPC w d` | Delete window |
| `SPC p f` | Find file in project |
| `SPC p p` | Switch project |
| `SPC /` | Search in project (grep) |
| `SPC s s` | Swiper (search in buffer) |

### Code

| Key | Action |
|-----|--------|
| `SPC m g g` | Go to definition |
| `SPC m g r` | Find references |
| `SPC m r r` | Rename symbol |
| `SPC m =` | Format buffer |
| `SPC e l` | List errors |
| `SPC e n / p` | Next / previous error |

### Git (Magit)

| Key | Action |
|-----|--------|
| `SPC g s` | Magit status |
| `SPC g b` | Git blame |
| `SPC g l` | Git log |
| `SPC g d` | Diff |

### Help

| Key | Action |
|-----|--------|
| `SPC h d f` | Describe function |
| `SPC h d k` | Describe key |
| `SPC h d v` | Describe variable |
| `SPC ?` | Show all keybindings |

---

## Layers

Layers are the core organizational unit — each bundles related packages and configuration.

### Enabling Layers

```elisp
;; In ~/.spacemacs → dotspacemacs-configuration-layers
dotspacemacs-configuration-layers
'(
  ;; Completion
  (auto-completion :variables
                   auto-completion-enable-snippets-in-popup t)
  helm  ;; or ivy

  ;; Programming
  python
  (rust :variables rust-backend 'lsp)
  (typescript :variables typescript-backend 'lsp)
  javascript
  emacs-lisp

  ;; Tools
  git
  (org :variables org-enable-github-support t)
  markdown
  yaml
  (shell :variables shell-default-shell 'vterm)
  treemacs
  lsp

  ;; Themes
  themes-megapack
)
```

### Popular Layers

| Layer | Provides |
|-------|----------|
| `auto-completion` | Company, snippets |
| `lsp` | Language Server Protocol support |
| `git` | Magit, git-gutter |
| `org` | Org-mode with extras |
| `python` | Python IDE features |
| `rust` | Rust development |
| `typescript` | TypeScript/JavaScript |
| `docker` | Dockerfile mode, docker commands |
| `markdown` | Preview, editing |
| `treemacs` | File tree sidebar |
| `shell` | Terminal integration |

---

## Configuration Sections

The `.spacemacs` file has clear sections:

```elisp
;; dotspacemacs/init — Spacemacs core settings
(defun dotspacemacs/init ()
  (setq-default
   dotspacemacs-editing-style 'vim          ;; 'vim, 'emacs, or 'hybrid
   dotspacemacs-themes '(doom-one gruvbox-dark-hard)
   dotspacemacs-default-font '("JetBrains Mono" :size 14)
   dotspacemacs-line-numbers '(:relative t)
   dotspacemacs-maximized-at-startup t))

;; dotspacemacs/user-init — Runs before packages load
(defun dotspacemacs/user-init ()
  (setq custom-file "~/.spacemacs.d/custom.el"))

;; dotspacemacs/user-config — Runs after packages load (your customizations)
(defun dotspacemacs/user-config ()
  ;; Your personal keybindings and settings
  (setq scroll-margin 5)
  (global-visual-line-mode t)
  
  ;; Custom leader bindings
  (spacemacs/set-leader-keys
    "o t" 'vterm
    "o f" 'treemacs))
```

---

## Tips

| Tip | How |
|-----|-----|
| Discover keys | Press `SPC` and wait — which-key shows options |
| Reload config | `SPC f e R` |
| Install new layer | Add to layers list → `SPC f e R` |
| Search commands | `SPC SPC` (M-x equivalent) |
| Toggle line numbers | `SPC t n` |
| Toggle fullscreen | `SPC T F` |
| Open terminal | `SPC '` |
| Universal argument | `SPC u` |

---

## Spacemacs vs Doom Emacs

| Aspect | Spacemacs | Doom Emacs |
|--------|-----------|-----------|
| Config approach | Layers (GUI-friendly) | Modules (code-first) |
| Startup time | Slower (2-5s) | Faster (< 1s) |
| Discoverability | Excellent (which-key everywhere) | Good |
| Customization | `.spacemacs` file | `config.el` + `packages.el` |
| Stability | Stable (develop branch can break) | Very stable |
| Learning curve | Lower (wizard, docs) | Moderate (need Elisp comfort) |
| Community | Larger, older | Growing, active |

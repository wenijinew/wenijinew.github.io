# Emacs

*Written: 2026-08-23*

## Overview

GNU Emacs — the extensible, self-documenting editor. More than a text editor: an operating environment built on Emacs Lisp.

| Aspect | Detail |
|--------|--------|
| Language | Emacs Lisp (Elisp) |
| Config | `~/.emacs.d/init.el` or `~/.emacs` |
| Package managers | package.el (built-in), straight.el, use-package |
| GUI | Native GTK/NS or terminal (emacs -nw) |
| Philosophy | "An OS masquerading as an editor" |

---

## Essential Keybindings

### Navigation

| Key | Action |
|-----|--------|
| `C-f / C-b` | Forward / backward character |
| `M-f / M-b` | Forward / backward word |
| `C-n / C-p` | Next / previous line |
| `C-a / C-e` | Beginning / end of line |
| `M-< / M->` | Beginning / end of buffer |
| `C-v / M-v` | Page down / page up |
| `C-l` | Center current line in window |
| `C-s / C-r` | Incremental search forward / reverse |

### Editing

| Key | Action |
|-----|--------|
| `C-d` | Delete character forward |
| `M-d` | Kill word forward |
| `C-k` | Kill to end of line |
| `C-w` | Kill region (cut) |
| `M-w` | Copy region |
| `C-y` | Yank (paste) |
| `M-y` | Cycle through kill ring |
| `C-/` or `C-x u` | Undo |
| `C-x C-s` | Save buffer |
| `C-x C-f` | Find (open) file |

### Buffers & Windows

| Key | Action |
|-----|--------|
| `C-x b` | Switch buffer |
| `C-x k` | Kill buffer |
| `C-x 2` | Split window horizontally |
| `C-x 3` | Split window vertically |
| `C-x 1` | Delete other windows |
| `C-x o` | Switch to other window |
| `C-x C-b` | List buffers |

---

## Package Management

### use-package (Recommended)

```elisp
;; Bootstrap use-package
(require 'package)
(setq package-archives
      '(("melpa" . "https://melpa.org/packages/")
        ("gnu" . "https://elpa.gnu.org/packages/")))
(package-initialize)

(unless (package-installed-p 'use-package)
  (package-refresh-contents)
  (package-install 'use-package))

(require 'use-package)
(setq use-package-always-ensure t)
```

### Essential Packages

| Package | Purpose |
|---------|---------|
| `magit` | Git interface (best in class) |
| `lsp-mode` | Language Server Protocol |
| `company` | Auto-completion |
| `projectile` | Project management |
| `ivy` / `vertico` | Minibuffer completion |
| `flycheck` | Syntax checking |
| `treemacs` | File tree sidebar |
| `org-mode` | Notes, tasks, literate programming |
| `which-key` | Keybinding discovery |
| `evil` | Vim emulation |

---

## LSP Configuration

```elisp
(use-package lsp-mode
  :commands lsp
  :hook ((python-mode . lsp)
         (rust-mode . lsp)
         (typescript-mode . lsp))
  :config
  (setq lsp-idle-delay 0.5
        lsp-log-io nil
        lsp-completion-provider :capf))

(use-package lsp-ui
  :after lsp-mode
  :config
  (setq lsp-ui-doc-enable t
        lsp-ui-sideline-enable t))

(use-package company
  :hook (after-init . global-company-mode)
  :config
  (setq company-idle-delay 0.2
        company-minimum-prefix-length 1))
```

---

## Org-Mode Essentials

```org
* TODO Project planning          :work:
  DEADLINE: <2026-09-01>
** DONE Research phase
   CLOSED: [2026-08-20]
** TODO Implementation
   - [ ] Design API
   - [ ] Write tests
   - [X] Set up repo

#+BEGIN_SRC python
def hello():
    return "Hello from org-mode!"
#+END_SRC
```

| Key | Action |
|-----|--------|
| `TAB` | Cycle visibility |
| `M-RET` | New heading |
| `C-c C-t` | Toggle TODO state |
| `C-c C-d` | Set deadline |
| `C-c C-s` | Schedule |
| `C-c '` | Edit source block |
| `C-c C-c` | Execute source block |
| `C-c C-e` | Export (HTML, PDF, LaTeX) |

---

## Starter Config

```elisp
;; ~/.emacs.d/init.el — Minimal modern config

;; UI cleanup
(menu-bar-mode -1)
(tool-bar-mode -1)
(scroll-bar-mode -1)
(setq inhibit-startup-message t)

;; Line numbers
(global-display-line-numbers-mode 1)
(setq display-line-numbers-type 'relative)

;; Theme
(use-package doom-themes
  :config (load-theme 'doom-one t))

;; Completion
(use-package vertico :init (vertico-mode))
(use-package orderless
  :config (setq completion-styles '(orderless basic)))
(use-package marginalia :init (marginalia-mode))

;; Git
(use-package magit :bind ("C-x g" . magit-status))

;; Keybinding help
(use-package which-key :init (which-key-mode))

;; Better defaults
(setq-default indent-tabs-mode nil
              tab-width 4
              fill-column 80)
(setq auto-save-default nil
      make-backup-files nil
      create-lockfiles nil)
(global-auto-revert-mode 1)
(electric-pair-mode 1)
```

---

## Emacs vs Other Editors

| Feature | Emacs | Vim | VS Code |
|---------|-------|-----|---------|
| Extensibility | Elisp (full language) | VimScript/Lua | TypeScript (extensions) |
| Learning curve | Very steep | Steep (modal) | Gentle |
| Performance | Moderate | Excellent | Heavy (Electron) |
| Modal editing | Optional (evil-mode) | Native | Optional (extension) |
| Git integration | Magit (exceptional) | fugitive (good) | Built-in (good) |
| Org-mode | Native | No | No |
| Terminal use | Full support | Full support | Limited |
| IDE features | Via LSP | Via LSP | Built-in |

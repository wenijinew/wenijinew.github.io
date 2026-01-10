# VSpaceCode Keybindings User Guide

This guide covers the reorganized VSpaceCode keybindings that work with the Vim leader key (`,`) and the which-key interface. These bindings mirror the Alt key structure for consistent muscle memory across both input methods.

## 🎯 How to Use

1. **Enter Normal/Visual mode** in Vim
2. **Press `,` (comma)** - the leader key
3. **Press category letter** (e.g., `s` for Settings)
4. **Press action letter** (e.g., `s` for Settings)
5. **Result**: `,s,s` opens VS Code settings

## 📋 Quick Reference Categories

| Category | Letter | Description | Example |
|----------|--------|-------------|---------|
| **Settings** | `s` | Configuration and preferences | `,s,s` → Open Settings |
| **Files** | `f` | File operations | `,f,s` → Save File |
| **Editor** | `e` | Text editing and navigation | `,e,c` → Close Editor |
| **Layout** | `l` | Window splitting and arrangement | `,l,v` → Split Vertical |
| **Terminal** | `t` | Terminal operations | `,t,t` → Toggle Terminal |
| **Views** | `v` | Panels and navigation | `,v,f` → Focus File Explorer |
| **Git** | `g` | Version control | `,g,c` → Git Commit |
| **Jupyter** | `j` | Notebook operations | `,j,r` → Restart Kernel |
| **References** | `r` | Code references and search | `,r,r` → Go to References |
| **Workspace** | `w` | Window and workspace management | `,w,n` → New Window |
| **Codeium** | `c` | AI assistance (Codeium) | `,c,c` → Open Chat |
| **Amazon Q** | `q` | AI assistance (Amazon Q) | `,q,e` → Explain Code |
| **Python** | `p` | Python development | `,p,r` → Run Selection |
| **Merge** | `m` | Merge conflict resolution | `,m,c` → Accept Current |
| **Updates** | `u` | System updates and maintenance | `,u,r` → Release Notes |
| **Utilities** | `z` | Miscellaneous utilities | `,z,j` → Sort JSON |

## 🔧 Settings & Configuration (`,s`)

| Shortcut | Action | Description |
|----------|--------|-------------|
| `,s,s` | Open Settings | Open VS Code settings UI |
| `,s,j` | Open Settings JSON | Edit settings.json directly |
| `,s,k` | Open Keybindings | Open keyboard shortcuts settings |
| `,s,t` | Select Theme | Choose color theme |
| `,s,p` | Switch Profile | Change VS Code profile |
| `,s,m` | Change Language Mode | Set file language mode |

## 📁 File Operations (`,f`)

| Shortcut | Action | Description |
|----------|--------|-------------|
| `,f,s` | Save File | Save current file |
| `,f,a` | Save All Files | Save all open files |
| `,f,o` | Open File | Open file dialog |
| `,f,r` | Open Recent | Open recent files/workspaces |
| `,f,R` | Revert File | Revert to last saved state |

## ✏️ Editor Operations (`,e`)

| Shortcut | Action | Description |
|----------|--------|-------------|
| `,e,c` | Close Editor | Close current editor tab |
| `,e,o` | Close Other Editors | Close all other tabs |
| `,e,O` | Close Other Groups | Close editors in other groups |
| `,e,g` | Go to Line | Jump to specific line |
| `,e,d` | Go to Definition | Navigate to symbol definition |
| `,e,r` | Rename Symbol | Rename symbol at cursor |
| `,e,n` | Next Error | Go to next error/warning |
| `,e,f` | Format Document | Format entire document |

## 🔲 Layout & Splitting (`,l`)

| Shortcut | Action | Description |
|----------|--------|-------------|
| `,l,v` | Split Vertical | Split editor vertically |
| `,l,h` | Split Horizontal | Split editor horizontally |
| `,l,j` | Focus Left Group | Focus left editor group |
| `,l,k` | Focus Right Group | Focus right editor group |
| `,l,1` | Single Column | Set single column layout |
| `,l,2` | Two Columns | Set two column layout |
| `,l,3` | Three Columns | Set three column layout |

## 💻 Terminal Operations (`,t`)

| Shortcut | Action | Description |
|----------|--------|-------------|
| `,t,t` | Toggle Terminal | Show/hide terminal |
| `,t,n` | New Terminal | Create new terminal |
| `,t,s` | Split Terminal | Split current terminal |
| `,t,p` | Toggle Panel | Show/hide bottom panel |

## 👁️ Views & Navigation (`,v`)

| Shortcut | Action | Description |
|----------|--------|-------------|
| `,v,f` | Focus File Explorer | Open and focus file explorer |
| `,v,e` | View Extensions | Open extensions view |
| `,v,s` | Focus Search | Open and focus search |
| `,v,g` | Focus Git | Open source control view |
| `,v,d` | View Debug | Open debug view |
| `,v,t` | View Testing | Open testing view |
| `,v,o` | Focus Outline | Focus outline view |
| `,v,b` | Toggle Sidebar | Show/hide sidebar |

## 🔀 Git Operations (`,g`)

| Shortcut | Action | Description |
|----------|--------|-------------|
| `,g,c` | Git Commit | Commit staged changes |
| `,g,s` | Git Stage All | Stage all changes |
| `,g,p` | Git Push | Push to remote |
| `,g,P` | Git Pull | Pull from remote |
| `,g,r` | Git Revert | Revert current change |
| `,g,b` | Git Checkout | Switch branch |
| `,g,n` | Next Git Change | Go to next change |
| `,g,l` | Lazygit | Open Lazygit interface |

## 📓 Jupyter Operations (`,j`)

| Shortcut | Action | Description |
|----------|--------|-------------|
| `,j,r` | Restart Kernel | Restart Jupyter kernel |
| `,j,R` | Restart & Run All | Restart and run all cells |
| `,j,k` | Select Kernel | Choose Jupyter kernel |
| `,j,p` | Select Python Env | Choose Python environment |
| `,j,i` | Interrupt Kernel | Stop kernel execution |
| `,j,d` | Clear Outputs | Clear cell outputs |
| `,j,m` | Change to Markdown | Convert cell to markdown |

## 🔍 References & Search (`,r`)

| Shortcut | Action | Description |
|----------|--------|-------------|
| `,r,r` | Go to References | Find all references |
| `,r,n` | Next Reference | Go to next reference |
| `,r,p` | Previous Reference | Go to previous reference |
| `,r,c` | Clear Search Results | Clear search results |

## 🏢 Workspace & Windows (`,w`)

| Shortcut | Action | Description |
|----------|--------|-------------|
| `,w,n` | New Window | Open new VS Code window |
| `,w,c` | Close Window | Close current window |
| `,w,o` | Close Other Windows | Close all other windows |
| `,w,q` | Quit Application | Exit VS Code |
| `,w,r` | Recent Workspaces | Open recent workspace |
| `,w,a` | Add Folder | Add folder to workspace |
| `,w,s` | Switch Window | Switch between windows |

## 🤖 Codeium AI (`,c`)

| Shortcut | Action | Description |
|----------|--------|-------------|
| `,c,c` | Open Chat | Open Codeium chat |
| `,c,v` | Toggle Chat Panel | Show/hide chat panel |
| `,c,p` | Open Profile | Open Codeium profile |
| `,c,i` | Login | Login to Codeium |
| `,c,o` | Logout | Logout from Codeium |
| `,c,e` | Toggle Enable | Enable/disable Codeium |
| `,c,r` | Restart Server | Restart language server |
| `,c,n` | Next Completion | Show next completion |
| `,c,a` | Accept Suggestion | Accept AI suggestion |
| `,c,d` | Reject Suggestion | Reject AI suggestion |
| `,c,x` | Explain Code | Explain selected code |
| `,c,f` | Refactor Code | Refactor selected code |
| `,c,s` | Snooze AutoComplete | Temporarily disable |
| `,c,t` | Toggle AutoComplete | Enable/disable for language |
| `,c,u` | Open University | Open Codeium University |

## 🔮 Amazon Q AI (`,q`)

| Shortcut | Action | Description |
|----------|--------|-------------|
| `,q,c` | Focus Chat | Focus Amazon Q chat |
| `,q,e` | Explain Code | Explain selected code |
| `,q,f` | Fix Code | Fix code issues |
| `,q,t` | Generate Tests | Generate unit tests |
| `,q,i` | Inline Chat | Start inline chat |
| `,q,m` | Manual Completion | Trigger completion |
| `,q,o` | Optimize Code | Optimize selected code |
| `,q,r` | Refactor Code | Refactor selected code |
| `,q,s` | Toggle Suggestions | Enable/disable suggestions |
| `,q,d` | Dev Menu | Open developer menu |

## 🐍 Python Development (`,p`)

| Shortcut | Action | Description |
|----------|--------|-------------|
| `,p,r` | Run Selection | Execute selected Python code |
| `,p,i` | Select Interpreter | Choose Python interpreter |
| `,p,o` | Organize Imports | Organize Python imports |
| `,p,s` | Restart Pylint | Restart Pylint server |

## 🔀 Merge Conflicts (`,m`)

| Shortcut | Action | Description |
|----------|--------|-------------|
| `,m,n` | Next Conflict | Go to next merge conflict |
| `,m,p` | Previous Conflict | Go to previous conflict |
| `,m,c` | Accept Current | Accept current change |
| `,m,i` | Accept Incoming | Accept incoming change |
| `,m,b` | Accept Both | Accept both changes |

## 🔄 Updates & System (`,u`)

| Shortcut | Action | Description |
|----------|--------|-------------|
| `,u,r` | Show Release Notes | View current release notes |
| `,u,c` | Check for Updates | Check for VS Code updates |
| `,u,i` | Install Update | Install available update |
| `,u,w` | Reload Window | Reload current window |
| `,u,d` | Toggle Dev Tools | Open developer tools |

## 🛠️ Utilities (`,z`)

| Shortcut | Action | Description |
|----------|--------|-------------|
| `,z,j` | Sort JSON | Sort JSON file |
| `,z,s` | Symbol Outline | Go to symbol in file |
| `,z,t` | Random Theme | Apply random theme |
| `,z,e` | Reveal in Explorer | Show file in explorer |
| `,z,a` | Add Project | Add project to workspace |
| `,z,r` | Refresh Projects | Refresh project list |

## 💡 Tips for Mastery

### **Learning Strategy**
1. **Start with essentials**: Master file operations (`,f`) and editor operations (`,e`) first
2. **One category per day**: Focus on learning one category thoroughly
3. **Practice frequently used actions**: Repeat common shortcuts until automatic
4. **Use the which-key interface**: The popup menu helps you discover and remember shortcuts

### **Muscle Memory Building**
- **Consistent patterns**: Same logic as Alt key shortcuts
- **Mnemonic associations**: Letters match action names (s=Save, c=Close, etc.)
- **Progressive complexity**: Simple actions use single letters, complex ones use combinations

### **Which-Key Interface**
- **Visual guidance**: Shows available options after pressing `,`
- **Organized display**: Commands grouped by category with icons
- **Timeout setting**: 200ms delay before showing menu (configurable)

### **Vim Integration**
- **Normal mode**: Press `,` in normal mode to access commands
- **Visual mode**: Press `,` in visual mode for context-aware commands
- **No conflicts**: Leader key doesn't interfere with standard Vim commands

## 🔧 Customization

### **Modify Delay**
```json
"whichkey.delay": 200  // Milliseconds before showing menu
```

### **Add Custom Bindings**
Add to `vspacecode.bindingOverrides` in settings.json:
```json
{
    "name": "My Custom Command",
    "command": "workbench.action.myCommand",
    "icon": "gear",
    "keys": "z.c",
    "type": "command"
}
```

### **Change Leader Key**
```json
"vim.leader": ","  // Change to different key if needed
```

## 🚀 Getting Started

1. **Ensure VSpaceCode extension is installed**
2. **Verify Vim extension is active**
3. **Check leader key is set to `,`**
4. **Start with file operations**: Try `,f,s` to save
5. **Explore categories gradually**: Use which-key menu to discover commands
6. **Practice daily**: Build muscle memory through repetition

The VSpaceCode bindings provide a powerful, discoverable way to access VS Code functionality through Vim, perfectly complementing the Alt key shortcuts for a complete keyboard-driven workflow!
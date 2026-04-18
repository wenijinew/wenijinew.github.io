# Windows Winlogon Shell & Kiro CLI Auto-Start Setup

## 1. Set Winlogon Shell to start.bat

Open `regedit` and navigate to:

```
HKEY_CURRENT_USER\Software\Microsoft\Windows NT\CurrentVersion\Winlogon
```

Create or modify the `Shell` string value:

```
Name:  Shell
Type:  REG_SZ
Value: C:\Users\egugwen\start.bat
```

Or apply via command line (run as Administrator):

```cmd
reg add "HKCU\Software\Microsoft\Windows NT\CurrentVersion\Winlogon" /v Shell /t REG_SZ /d "C:\Users\egugwen\start.bat" /f
```

> **Note:** This overrides the default `explorer.exe` shell for your user. Make sure `start.bat` launches Explorer or anything else you need, e.g.:
>
> ```bat
> @echo off
> start "" "C:\Windows\explorer.exe"
> rem Add other startup commands here
> ```

## 2. Auto-Start kiro-cli from PowerShell Profile

Add the following to your PowerShell profile (`$PROFILE`, typically `~\Documents\PowerShell\Microsoft.PowerShell_profile.ps1`):

```powershell
function Start-KiroCli {
    if (-not (Get-Process -Name "kiro-cli" -ErrorAction SilentlyContinue)) {
        Start-Process "kiro-cli"
    }
}

Start-KiroCli
```

If the profile file doesn't exist yet:

```powershell
New-Item -Path $PROFILE -ItemType File -Force
notepad $PROFILE
```

## Revert Winlogon Shell to Default

```cmd
reg delete "HKCU\Software\Microsoft\Windows NT\CurrentVersion\Winlogon" /v Shell /f
```

This restores the default `explorer.exe` shell from the machine-level setting.

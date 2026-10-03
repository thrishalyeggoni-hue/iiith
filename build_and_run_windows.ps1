# ==============================================================================
# Quantum Echo: The City That Forgot - Windows Automated Build & Launch Script
# ==============================================================================

param (
    [string]$UnityPath = ""
)

$ErrorActionPreference = "Stop"

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host " QUANTUM ECHO: THE CITY THAT FORGOT" -ForegroundColor White
Write-Host " Automated Windows Setup & Standalone Build Script" -ForegroundColor Yellow
Write-Host "======================================================================" -ForegroundColor Cyan

$ProjectPath = $PSScriptRoot
$LogDir = Join-Path $ProjectPath "Logs"
if (-not (Test-Path $LogDir)) { New-Item -ItemType Directory -Path $LogDir | Out-Null }

$SetupLog = Join-Path $LogDir "setup.log"
$BuildLog = Join-Path $LogDir "build.log"
$BuildExe = Join-Path $ProjectPath "Builds\Windows\QuantumEcho.exe"

# 1. Locate Unity Editor on Windows
Write-Host "`n[1/3] Locating Unity Editor installation..." -ForegroundColor Cyan

$UnityExe = $null

if ($UnityPath -and (Test-Path $UnityPath)) {
    $UnityExe = (Resolve-Path $UnityPath).Path
} elseif ($env:UNITY_EXE -and (Test-Path $env:UNITY_EXE)) {
    $UnityExe = (Resolve-Path $env:UNITY_EXE).Path
} else {
    $UnitySearchPatterns = @(
        "C:\Program Files\Unity\Hub\Editor\*\Editor\Unity.exe",
        "C:\Program Files\Unity\Editor\Unity.exe",
        "D:\Program Files\Unity\Hub\Editor\*\Editor\Unity.exe",
        "D:\Unity\Hub\Editor\*\Editor\Unity.exe",
        "E:\Program Files\Unity\Hub\Editor\*\Editor\Unity.exe",
        "${env:ProgramFiles}\Unity\Hub\Editor\*\Editor\Unity.exe",
        "${env:LOCALAPPDATA}\Programs\Unity\Hub\Editor\*\Editor\Unity.exe"
    )

    foreach ($pattern in $UnitySearchPatterns) {
        $matches = Resolve-Path $pattern -ErrorAction SilentlyContinue
        if ($matches) {
            $UnityExe = ($matches | Sort-Object Path -Descending | Select-Object -First 1).Path
            break
        }
    }
}

if (-not $UnityExe) {
    Write-Host "[ERROR] Could not automatically locate Unity.exe on your Windows PC." -ForegroundColor Red
    Write-Host "Please ensure Unity (2022.3 LTS or compatible) is installed." -ForegroundColor Yellow
    Write-Host "`nYou can run this script with a direct path, for example:" -ForegroundColor Yellow
    Write-Host "  .\build_and_run_windows.ps1 -UnityPath 'C:\Program Files\Unity\Hub\Editor\2022.3.XXf1\Editor\Unity.exe'" -ForegroundColor White
    exit 1
}

Write-Host "Found Unity Editor: $UnityExe" -ForegroundColor Green

# 2. Run Idempotent Project Setup (generates scenes, components, build settings)
Write-Host "`n[2/3] Running automated scene generation & reference wiring..." -ForegroundColor Cyan
Write-Host "Executing method: QuantumEcho.Editor.EditorProjectSetup.SetupProject" -ForegroundColor Gray

$setupArgs = @(
    "-batchmode",
    "-quit",
    "-projectPath", "`"$ProjectPath`"",
    "-executeMethod", "QuantumEcho.Editor.EditorProjectSetup.SetupProject",
    "-logFile", "`"$SetupLog`""
)

$setupProcess = Start-Process -FilePath $UnityExe -ArgumentList $setupArgs -Wait -PassThru -NoNewWindow
if (Test-Path $SetupLog) {
    Write-Host "Setup completed (Exit code: $($setupProcess.ExitCode)). Log: $SetupLog" -ForegroundColor Gray
}

# 3. Build Standalone Windows x64 Executable
Write-Host "`n[3/3] Compiling Standalone Windows x64 Player..." -ForegroundColor Cyan
Write-Host "Executing method: QuantumEcho.Editor.WindowsBuildScript.BuildWindows" -ForegroundColor Gray

$buildArgs = @(
    "-batchmode",
    "-quit",
    "-projectPath", "`"$ProjectPath`"",
    "-executeMethod", "QuantumEcho.Editor.WindowsBuildScript.BuildWindows",
    "-logFile", "`"$BuildLog`""
)

$buildProcess = Start-Process -FilePath $UnityExe -ArgumentList $buildArgs -Wait -PassThru -NoNewWindow
if (Test-Path $BuildLog) {
    Write-Host "Build finished (Exit code: $($buildProcess.ExitCode)). Log: $BuildLog" -ForegroundColor Gray
}

# 4. Verify Output and Launch
if (Test-Path $BuildExe) {
    Write-Host "`n======================================================================" -ForegroundColor Green
    Write-Host " BUILD SUCCEEDED!" -ForegroundColor Green
    Write-Host " Executable created at: $BuildExe" -ForegroundColor White
    Write-Host " Launching 'Quantum Echo: The City That Forgot'..." -ForegroundColor Cyan
    Write-Host "======================================================================" -ForegroundColor Green
    Start-Process -FilePath $BuildExe
} else {
    Write-Host "`n[WARNING] Executable not found at $BuildExe." -ForegroundColor Yellow
    Write-Host "Please inspect '$BuildLog' for details." -ForegroundColor Yellow
    Write-Host "Alternatively, open the project in Unity Hub and press Play directly in 'Assets/Scenes/MainCity.unity'." -ForegroundColor Cyan
}

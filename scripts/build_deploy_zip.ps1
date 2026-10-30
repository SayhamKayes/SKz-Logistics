# Build and Package Script for cPanel Deployment
# Generates 100% Linux/Unix compatible ZIP archives with forward slashes
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$rootDir = (Get-Item .).FullName
$deployDir = Join-Path $rootDir "deploy_cpanel"

if (-not (Test-Path $deployDir)) {
    New-Item -ItemType Directory -Path $deployDir | Out-Null
}

function Create-UnixZip {
    param(
        [string]$SourceDir,
        [string]$ZipPath,
        [string[]]$ExcludeDirs = @(),
        [string[]]$ExcludeFiles = @()
    )
    if (Test-Path $ZipPath) { Remove-Item $ZipPath -Force }
    $zip = [System.IO.Compression.ZipFile]::Open($ZipPath, [System.IO.Compression.ZipArchiveMode]::Create)
    
    $files = Get-ChildItem -Path $SourceDir -Recurse -File -Force
    foreach ($file in $files) {
        $relPath = $file.FullName.Substring($SourceDir.Length).TrimStart('\', '/')
        
        # Check folder exclusions
        $skip = $false
        foreach ($ex in $ExcludeDirs) {
            if ($relPath.StartsWith("$ex\") -or $relPath.StartsWith("$ex/") -or $relPath -match "[\\/]$ex[\\/]") {
                $skip = $true
                break
            }
        }
        if ($skip) { continue }
        if ($file.Extension -eq '.pyc') { continue }
        
        # Check file exclusions
        if ($ExcludeFiles -contains $file.Name) { continue }
        
        # Unix forward-slash entry path
        $entryName = $relPath.Replace('\', '/')
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $file.FullName, $entryName, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
    }
    $zip.Dispose()
}

Write-Host "1. Building React Frontend..."
npm run build

Write-Host "2. Packaging Frontend for public_html with Unix forward slashes..."
$distZip = Join-Path $deployDir "public_html_frontend.zip"
Create-UnixZip -SourceDir "$rootDir\dist" -ZipPath $distZip
Write-Host "-> Created: $distZip"

Write-Host "3. Packaging Backend for sain_backend with Unix forward slashes..."
$backendZip = Join-Path $deployDir "sain_backend.zip"
Create-UnixZip -SourceDir "$rootDir\Backend" -ZipPath $backendZip -ExcludeDirs @('sain_env', '__pycache__', '.git', '.vscode', 'staticfiles') -ExcludeFiles @('db.sqlite3', '.env')
Write-Host "-> Created: $backendZip"

Write-Host "=========================================="
Write-Host "Deployment ZIP packages successfully built!"
Write-Host "Upload public_html_frontend.zip to /home/saininte/public_html/"
Write-Host "Upload sain_backend.zip to /home/saininte/sain_backend/"
Write-Host "=========================================="

# One-time fix: point Cursor away from the retired keyvora path.
# Close Cursor completely before running this script.

$ErrorActionPreference = "Stop"
$realtorHost = "C:\Users\jadab\Projects\realtor-host"
$keyvora = "C:\Users\jadab\Projects\keyvora"
$workspaceStorage = "$env:APPDATA\Cursor\User\workspaceStorage"
$globalStorage = "$env:APPDATA\Cursor\User\globalStorage\storage.json"

Write-Host "Realtor Host — Cursor workspace cleanup`n"

if (-not (Test-Path $realtorHost)) {
  throw "Missing project folder: $realtorHost"
}

if (Test-Path $keyvora) {
  Write-Host "Removing stale keyvora path..."
  $item = Get-Item $keyvora -Force
  if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) {
    cmd /c rmdir $keyvora
  } else {
    throw "keyvora exists and is not a junction. Rename or move it manually before running this script."
  }
}

Write-Host "Scanning Cursor workspaceStorage for keyvora URIs..."
if (Test-Path $workspaceStorage) {
  Get-ChildItem $workspaceStorage -Directory | ForEach-Object {
    $workspaceJson = Join-Path $_.FullName "workspace.json"
    if (Test-Path $workspaceJson) {
      $raw = Get-Content $workspaceJson -Raw
      if ($raw -match "keyvora") {
        Write-Host "  Found keyvora in $($_.Name)"
        $updated = $raw -replace "keyvora", "realtor-host"
        Set-Content -Path $workspaceJson -Value $updated -NoNewline
        Write-Host "  Updated -> realtor-host"
      }
    }
  }
}

if (Test-Path $globalStorage) {
  $raw = Get-Content $globalStorage -Raw
  if ($raw -match "keyvora") {
    Write-Host "Updating globalStorage recents..."
    $updated = $raw -replace "keyvora", "realtor-host"
    Set-Content -Path $globalStorage -Value $updated -NoNewline
  }
}

Write-Host "`nDone."
Write-Host "Next steps:"
Write-Host "  1. Open Cursor"
Write-Host "  2. File -> Open Folder -> $realtorHost"
Write-Host "  3. Start a NEW chat from that workspace"
Write-Host "  4. Do not reopen old Keyvora chats for terminal work"

# Restart Realtor Host dev server on port 3000 (Windows)
$port = 3000
$connections = netstat -ano | Select-String ":$port\s+.*LISTENING"
foreach ($line in $connections) {
  if ($line -match "\s+(\d+)\s*$") {
    $pid = [int]$Matches[1]
    $proc = Get-Process -Id $pid -ErrorAction SilentlyContinue
    if ($proc -and $proc.ProcessName -eq "node") {
      Write-Host "Stopping node.exe PID $pid on port $port..."
      Stop-Process -Id $pid -Force
    }
  }
}
Set-Location $PSScriptRoot\..
npm run dev

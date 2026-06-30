$body = ''{"query":"PM-KISAN","language":"hi"}''
try {
  $r = Invoke-WebRequest -Uri "http://localhost:8000/api/explainer/explain" -Method POST -ContentType "application/json" -Body $body
  Write-Host "STATUS:" $r.StatusCode
  $r.Content.Substring(0, [Math]::Min(600, $r.Content.Length))
} catch {
  Write-Host "STATUS:" $_.Exception.Response.StatusCode.value__
  Write-Host $_.ErrorDetails.Message
}

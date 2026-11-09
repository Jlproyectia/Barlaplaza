$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
$projectRoot=(Resolve-Path $PSScriptRoot).Path
$assetRoot=Join-Path $projectRoot 'dist/assets'
$originalRoot=Join-Path $projectRoot 'originals'
New-Item -ItemType Directory -Force $originalRoot | Out-Null
$encoder=[System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
$parameters=New-Object System.Drawing.Imaging.EncoderParameters(1)
$parameters.Param[0]=New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality,88L)
$report=@()
foreach($source in Get-ChildItem -LiteralPath $assetRoot -Filter '*.png'){
  $resolved=$source.FullName
  if(-not $resolved.StartsWith($assetRoot+[IO.Path]::DirectorySeparatorChar,[StringComparison]::OrdinalIgnoreCase)){throw 'Unexpected path'}
  Copy-Item -LiteralPath $resolved -Destination (Join-Path $originalRoot $source.Name) -Force
  if($source.Name -match '^venue-\d{2}\.png$'){
    $bitmap=[System.Drawing.Image]::FromFile($resolved)
    $destination=[IO.Path]::ChangeExtension($resolved,'.jpg')
    $bitmap.Save($destination,$encoder,$parameters)
    $report+=@{file=[IO.Path]::GetFileName($destination);width=$bitmap.Width;height=$bitmap.Height;native4k=($bitmap.Width -ge 3840);bytes=(Get-Item -LiteralPath $destination).Length}
    $bitmap.Dispose()
  }
  # Generated source images remain in originals; only the web copies are removed.
  Remove-Item -LiteralPath $resolved
}
$parameters.Dispose()
$report|ConvertTo-Json|Set-Content -LiteralPath (Join-Path $projectRoot 'image-resolution-report.json') -Encoding utf8
Write-Output ('Optimized '+$report.Count+' images; originals preserved.')

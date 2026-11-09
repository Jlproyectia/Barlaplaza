$ErrorActionPreference='Stop'
$root=(Resolve-Path $PSScriptRoot).Path
$folder=Join-Path $root 'dist/assets/4k'
$converted=New-Object 'System.Collections.Generic.HashSet[string]'
while($converted.Count -lt 81){
 foreach($file in Get-ChildItem -LiteralPath $folder -Filter '*.jpg'){
  if($converted.Contains($file.BaseName)){continue}
  # Wait until the producer has closed the JPEG.
  try{$probe=[IO.File]::Open($file.FullName,[IO.FileMode]::Open,[IO.FileAccess]::Read,[IO.FileShare]::None);$probe.Dispose()}catch{continue}
  $destination=Join-Path $folder ($file.BaseName+'.webp')
  & ffmpeg -hide_banner -loglevel error -i $file.FullName -c:v libwebp -quality 90 -compression_level 6 -preset photo -threads 2 -y $destination
  if($LASTEXITCODE -ne 0){throw ('WebP failed: '+$file.Name)}
  $dimensions=& ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 $destination
  if($dimensions.Trim() -ne '3840,2160'){throw ('Unexpected dimensions: '+$file.Name+' '+$dimensions)}
  [void]$converted.Add($file.BaseName)
  Write-Output ('WEB 4K '+$converted.Count+'/81 '+$file.BaseName)
 }
 if($converted.Count -lt 81){Start-Sleep -Seconds 2}
}
Write-Output 'All 81 website images verified at 3840x2160.'

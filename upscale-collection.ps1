$ErrorActionPreference='Stop'
$root=(Resolve-Path $PSScriptRoot).Path
$engine=Join-Path $root 'outputs/superresolution/engine/realesrgan-ncnn-vulkan.exe'
$models=Join-Path $root 'outputs/superresolution/engine/models'
$inputRoot=Join-Path $root 'outputs/superresolution/collection-input'
$rawRoot=Join-Path $root 'outputs/superresolution/collection-raw'
$finalRoot=Join-Path $root 'dist/assets/4k'
New-Item -ItemType Directory -Force $inputRoot,$rawRoot,$finalRoot | Out-Null
$expected=@()
for($i=1;$i -le 80;$i++){
 $name='venue-'+$i.ToString('00');$expected+=$name
 if(Test-Path -LiteralPath (Join-Path $finalRoot ($name+'.jpg'))){continue}
 Copy-Item -LiteralPath (Join-Path $root ('originals/'+$name+'.png')) -Destination (Join-Path $inputRoot ($name+'.png')) -Force
}
$arguments='-i "'+$inputRoot+'" -o "'+$rawRoot+'" -n realesrgan-x4plus -m "'+$models+'" -s 4 -t 512 -g 1 -j 2:2:2 -f png'
$proc=Start-Process -FilePath $engine -ArgumentList $arguments -WorkingDirectory $root -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $root 'outputs/superresolution/batch.stdout.log') -RedirectStandardError (Join-Path $root 'outputs/superresolution/batch.stderr.log')
$processed=New-Object 'System.Collections.Generic.HashSet[string]'
foreach($name in $expected){if(Test-Path -LiteralPath (Join-Path $finalRoot ($name+'.jpg'))){[void]$processed.Add($name)}}
function Convert-ReadyImages {
 foreach($file in Get-ChildItem -LiteralPath $rawRoot -Filter '*.png'){
  if($processed.Contains($file.BaseName)){continue}
  try{& (Join-Path $root 'convert-4k.ps1') -InputImage $file.FullName -OutputImage (Join-Path $finalRoot ($file.BaseName+'.jpg'))}
  catch{continue}
  [void]$processed.Add($file.BaseName)
  Write-Output ('4K '+$processed.Count+'/80 '+$file.BaseName)
  @{completed=$processed.Count;total=80;last=$file.BaseName;updated=(Get-Date).ToString('o')} | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $root 'outputs/superresolution/progress.json') -Encoding utf8
  $checked=(Resolve-Path -LiteralPath $file.FullName).Path
  if(-not $checked.StartsWith($rawRoot+[IO.Path]::DirectorySeparatorChar,[StringComparison]::OrdinalIgnoreCase)){throw 'Unsafe temporary output path'}
  Remove-Item -LiteralPath $checked
 }
}
while(-not $proc.HasExited){Convert-ReadyImages;Start-Sleep -Milliseconds 700;$proc.Refresh()}
$proc.WaitForExit();Convert-ReadyImages
if($processed.Count -ne 80){throw ('Superresolution incomplete: '+$processed.Count+'/80. See outputs/superresolution/batch.stderr.log')}
Write-Output 'All 80 collection images are 3840x2160. Originals preserved.'

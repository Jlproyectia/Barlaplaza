param([Parameter(Mandatory=$true)][string]$InputImage,[Parameter(Mandatory=$true)][string]$OutputImage)
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
$source=[System.Drawing.Image]::FromFile((Resolve-Path -LiteralPath $InputImage).Path)
if($source.Width -lt 3840 -or $source.Height -lt 2160){$source.Dispose();throw 'The AI source is smaller than 4K.'}
$target=New-Object System.Drawing.Bitmap(3840,2160)
$graphics=[System.Drawing.Graphics]::FromImage($target)
$graphics.CompositingQuality=[System.Drawing.Drawing2D.CompositingQuality]::HighQuality
$graphics.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.SmoothingMode=[System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$graphics.PixelOffsetMode=[System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$cropHeight=$source.Width*2160/3840
$cropTop=($source.Height-$cropHeight)/2
$destination=New-Object System.Drawing.Rectangle(0,0,3840,2160)
$graphics.DrawImage($source,$destination,0,[single]$cropTop,[single]$source.Width,[single]$cropHeight,[System.Drawing.GraphicsUnit]::Pixel)
$codec=[System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
$parameters=New-Object System.Drawing.Imaging.EncoderParameters(1)
$parameters.Param[0]=New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality,94L)
$target.Save([IO.Path]::GetFullPath($OutputImage),$codec,$parameters)
$parameters.Dispose();$graphics.Dispose();$target.Dispose();$source.Dispose()

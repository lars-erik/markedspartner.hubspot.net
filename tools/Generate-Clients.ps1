$openapiPath = "$($PSScriptRoot)\..\openapi\"
$outputPath = "$($PSScriptRoot)\..\src\MarkedsPartner.HubSpot.Net\"

Get-ChildItem "$($openapiPath)*" -include *.yml | % { 
    nswag run "$($openapiPath)nswag.json" /runtime:NetCore31 /variables:input=$($openapiPath)$($_.Name),output=$($outputPath)$($_.Name.Replace(".yml", ".g.cs"))
}

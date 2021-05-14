param(
    $deploymentname = "MP-HubSpot-V3",
    $resourcegroup,
    $parameterfile
)

New-AzResourceGroupDeployment -Name $deploymentname -ResourceGroupName $resourcegroup -TemplateFile out.json -TemplateParameterFile $parameterfile
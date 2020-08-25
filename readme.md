# MarkedsPartner HubSpot Net

This is a temporary effort to create a .NET Core client for HubSpot
based on a handwritten OpenAPI specification.

When [HubSpot is "done"](https://github.com/lars-erik/markedspartner.hubspot.net.git)
publishing their specs, this will be updated to be generated from the
"official" spec instead.

To generate the .NET client you need to install the [nswag CLI tool](https://github.com/RicoSuter/NSwag/wiki/CommandLine).

In order to use the `ObjectsClient` (and others?) with an API key, use the ctor with an extra string parameter.  
In order to use OAuth, add the bearer authorization header value to the `HttpClient` before initializing the clients.
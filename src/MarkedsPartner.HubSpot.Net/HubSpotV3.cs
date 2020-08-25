//----------------------
// <auto-generated>
//     Generated using the NSwag toolchain v13.7.0.0 (NJsonSchema v10.1.24.0 (Newtonsoft.Json v12.0.0.0)) (http://NSwag.org)
// </auto-generated>
//----------------------

using System.Net.Http;

namespace MarkedsPartner.HubSpot.Net
{
    using System = global::System;
    
    public partial class ObjectsClient 
    {
        private readonly string apiKey;

        public ObjectsClient(HttpClient httpClient, string apiKey)
            : this(httpClient)
        {
            this.apiKey = apiKey;
        }

        partial void UpdateJsonSerializerSettings(Newtonsoft.Json.JsonSerializerSettings settings)
        {

        }

        partial void PrepareRequest(System.Net.Http.HttpClient client, System.Net.Http.HttpRequestMessage request, string url)
        {

        }

        partial void PrepareRequest(System.Net.Http.HttpClient client, System.Net.Http.HttpRequestMessage request, System.Text.StringBuilder urlBuilder)
        {
            if (!System.String.IsNullOrEmpty(apiKey))
            {
                urlBuilder.Append(urlBuilder.ToString().Contains("?") ? "&" : "?");
                urlBuilder.AppendFormat("hapikey={0}", apiKey);
            }
        }

        partial void ProcessResponse(System.Net.Http.HttpClient client, System.Net.Http.HttpResponseMessage response)
        {

        }
    
    }
}

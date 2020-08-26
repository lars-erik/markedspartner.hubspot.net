using System.Net.Http;
using System.Threading.Tasks;
using NUnit.Framework;
using Microsoft.Extensions.Configuration;

namespace MarkedsPartner.HubSpot.Net.Tests
{
    public class When_Getting_Companies
    {
        private HubSpotConfig config;

        [SetUp]
        public void Setup()
        {
            var configuration = new ConfigurationBuilder()
                .AddJsonFile("hubspot.json")
                .AddUserSecrets(GetType().Assembly)
                .Build();
            config = new HubSpotConfig();
            configuration.Bind("HubSpot", config);
        }

        [Test]
        public async Task Returns_Page_With_Limited_Results()
        {
            var client = new V3Client(new HttpClient(), config.ApiKey);
            var response = await client.ObjectsGetAsync("companies", limit: 2);

            response.Results.Dump();
            
            Assert.That(response.Results, Has.Count.EqualTo(2));
        }
    }
}
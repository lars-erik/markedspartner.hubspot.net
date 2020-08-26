using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

namespace MarkedsPartner.HubSpot.Net.Tests
{
    public static class JsonExtensions
    {
        public static string ToJson(this object obj, bool indent = false)
        {
            return JsonConvert.SerializeObject(obj, indent ? Formatting.Indented : Formatting.None);
        }

        public static void Dump(this object obj)
        {
            Console.WriteLine(obj.ToJson(true));
        }
    }
}

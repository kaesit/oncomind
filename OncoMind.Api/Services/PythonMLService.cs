using System.Web;

namespace OncoMind.Api.Services
{
     public class PythonMLService
     {
          private readonly HttpClient _httpClient;

          public PythonMLService(HttpClient httpClient, IConfiguration config)
          {
               _httpClient = httpClient;
               // Load the URL from appsettings or Environment variables (Docker)
               var baseUrl = config["ServiceUrls:PythonML"] ?? "http://localhost:8000";
               _httpClient.BaseAddress = new Uri(baseUrl);
          }

          // 1. Fetch the CSV Data
          public async Task<string> GetDatasetCsvAsync()
          {
               var response = await _httpClient.GetAsync("/datasets/CHEMBL1978_nonredundant.csv");
               response.EnsureSuccessStatusCode();
               return await response.Content.ReadAsStringAsync();
          }

          // 2. Fetch Histogram Image (Stream is efficient for images)
          public async Task<Stream> GetHistogramAsync()
          {
               var response = await _httpClient.GetAsync("/hystogram");
               response.EnsureSuccessStatusCode();
               return await response.Content.ReadAsStreamAsync();
          }

          // 3. Fetch Parabol Image (Forwarding Parameters)
          public async Task<Stream> GetParabolAsync(double[] x, double[] y)
          {
               // We need to rebuild the query string: ?x=1&x=2&y=3...
               var query = HttpUtility.ParseQueryString(string.Empty);
               foreach (var val in x) query.Add("x", val.ToString());
               foreach (var val in y) query.Add("y", val.ToString());

               var response = await _httpClient.GetAsync($"/parabol?{query}");
               response.EnsureSuccessStatusCode();
               return await response.Content.ReadAsStreamAsync();
          }

          // 4. Fetch Scatter Line Image
          public async Task<Stream> GetScatterLineAsync(double[] x, double[] y)
          {
               var query = HttpUtility.ParseQueryString(string.Empty);
               foreach (var val in x) query.Add("x", val.ToString());
               foreach (var val in y) query.Add("y", val.ToString());

               var response = await _httpClient.GetAsync($"/scatter_line?{query}");
               response.EnsureSuccessStatusCode();
               return await response.Content.ReadAsStreamAsync();
          }
     }
}
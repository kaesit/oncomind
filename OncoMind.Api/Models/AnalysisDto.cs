namespace OncoMind.Api.Models
{
     public class AnalysisDto
     {
          public string? Id { get; set; }
          public DateTime Date { get; set; }
          public string Type { get; set; } = "Unknown";
          public string Doctor { get; set; } = "System";

          // Keep this as object, but we will shape it in the Service
          public object? Summary { get; set; }
     }
}
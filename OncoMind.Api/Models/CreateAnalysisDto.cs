using System.ComponentModel.DataAnnotations;

namespace OncoMind.Api.Models
{
     public class AnalysisResultDto
     {
          public string Summary { get; set; } = string.Empty;
     }
     public class CreateAnalysisDto
     {
          [Required]
          public string PatientId { get; set; } = string.Empty; // 👈 CRITICAL

          [Required]
          public string DoctorId { get; set; } = string.Empty; // 👈 CRITICAL

          [Required]
          public string AnalysisType { get; set; } = "General Checkup";

          // We accept a dictionary so we can store "Summary", "Details", etc.
          public AnalysisResultDto ResultData { get; set; } = new();
     }
}
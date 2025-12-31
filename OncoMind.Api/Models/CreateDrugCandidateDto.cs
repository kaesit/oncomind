using System.ComponentModel.DataAnnotations;

namespace OncoMind.Api.Models
{
     public class CreateDrugCandidatesDto
     {
          // "required" keyword (C# 11) or = string.Empty fixes the warning
          [Required]
          public string Id { get; set; } = string.Empty;

          [Required]
          public string Smiles { get; set; } = string.Empty;

          [Required]
          public string QedScore { get; set; } = string.Empty;

          [Required]
          public string MwScore { get; set; } = string.Empty;

          public string MoleculeImage { get; set; } = string.Empty;
     }
}
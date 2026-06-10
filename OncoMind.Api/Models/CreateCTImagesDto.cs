using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace OncoMind.Api.Models
{
    public class CreateCTImagesDto
    {
        [Required]
        public string PatientId { get; set; } = string.Empty;
        [Required]
        public string DoctorId { get; set; } = string.Empty;

        [Required]
        public string? DoctorNote { get; set; }

        [Required]
        public List<TumorPostTreat> PostTreat { get; set; } = new();

    }
}
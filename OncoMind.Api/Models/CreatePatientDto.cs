using System.ComponentModel.DataAnnotations;

namespace OncoMind.Api.Models
{
    public class CreatePatientDto
    {
        [Required]
        public string FirstName { get; set; } = string.Empty;
        
        [Required]
        public string LastName { get; set; } = string.Empty;
        
        [Range(0, 120)]
        public int Age { get; set; }
        
        public string Gender { get; set; } = "Male"; // "Male" or "Female" string from Frontend
        
        public string EmergencyStatus { get; set; } = "Stable";

        public string ProfilePicture { get; set; } = "";
        public string AdmissionLocation { get; set; } = "";
        
        // We will grab DoctorID from the logged-in session/token ideally, 
        // but for now, we can pass it or set a default.
        public string? AssignedDoctorId { get; set; }
    }
}
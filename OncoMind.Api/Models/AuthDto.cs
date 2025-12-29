using System.ComponentModel.DataAnnotations;

namespace OncoMind.Api.Models
{
    public class DoctorRegisterDto
    {
        [Required] public string FirstName { get; set; } = "";
        [Required] public string LastName { get; set; } = "";
        [Required, EmailAddress] public string Email { get; set; } = "";
        [Required] public string Password { get; set; } = "";
        public string Specialization { get; set; } = "Oncologist";
        public DateTime DateOfBirth { get; set; }
        public string ProfilePicture { get; set; } = "";
    }

    public class DoctorLoginDto
    {
        [Required, EmailAddress] public string Email { get; set; } = "";
        [Required] public string Password { get; set; } = "";
    }
}
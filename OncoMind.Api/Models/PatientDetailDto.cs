namespace OncoMind.Api.Models
{
    public class PatientDetailDto
    {
        // Copy properties from Patient
        public string Id { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public int Age { get; set; }
        public string Gender { get; set; } = null!;
        public string EmergencyStatus { get; set; } = null!;
        public string AdmissionLocation { get; set; } = null!;
        public DateTime? TreatmentStartAt { get; set; }
        public string ProfilePicture { get; set; } = null!;

        // The Magic Part: The actual list of objects, not just IDs
        public List<Analysis> Examinations { get; set; } = new();
    }
}
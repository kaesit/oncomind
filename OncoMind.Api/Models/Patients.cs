using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;


namespace OncoMind.Api.Models
{
    public class Patients
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        // --- REFERENCE: Link to the Doctor ---
        [BsonRepresentation(BsonType.ObjectId)]
        public string? AssignedDoctorId { get; set; }

        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public int Age { get; set; }

        [BsonRepresentation(BsonType.String)]
        public Gender Gender { get; set; }

        public string EmergencyStatus { get; set; } = "Stable";
        public bool IsAdmitted { get; set; } = false;
        public string AdmissionLocation { get; set; } = "";

        // --- REFERENCE: Link to Analysis Results ---
        [BsonRepresentation(BsonType.ObjectId)]
        public List<string> AnalysisIds { get; set; } = new();

        public string ProfilePicture { get; set; } = "";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public enum Gender { Male, Female }
}
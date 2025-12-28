using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace OncoMind.Api.Models
{
     public class Doctor
     {
          [BsonId]
          [BsonRepresentation(BsonType.ObjectId)]
          public string? Id { get; set; }

          public string FirstName { get; set; } = null!;
          public string LastName { get; set; } = null!;
          public string Specialization { get; set; } = "Oncologist";
          public string Email { get; set; } = null!;

          // Store DOB, calculate Age dynamically in UI or Controller
          public DateTime DateOfBirth { get; set; }

          public string ProfilePicture { get; set; } = "";

          // Minimal stats to avoid heavy queries
          public int TotalPatientsCount { get; set; }

          public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
     }
}
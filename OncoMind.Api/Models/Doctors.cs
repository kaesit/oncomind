using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;


namespace OncoMind.Api.Models
{
     public class Doctors
     {
          [BsonId]
          [BsonRepresentation(BsonType.ObjectId)]
          public string? Id { get; set; }
          
          [BsonRepresentation(BsonType.ObjectId)]
          public string DoctorId { get; set; } = null!;
          //a
          public string FirstName { get; set;} = null!;
          public string LastName { get; set;} = null!;

          public DateTime DateOfBirth { get; set; }
        
        // Helper to get age in code (not stored in DB)
          [BsonIgnore] 
          public int Age => DateTime.Now.Year - DateOfBirth.Year;

          public string ProfilePicture { get; set; } = null!; // URL to image
          public string Specialization { get; set; } = "Oncologist";

          public List<string> ExaminationHistory { get; set; } = new();

          public List<string> ExaminationReports { get; set; } = new();

          public List<Patients> Patients { get; set; } = new();

          public List<Tuple<Patients, DateTime>> PatientsScannedTotal { get; set; } = new();

          public List<Tuple<Patients, DateTime>> AssignedAt { get; set; } = new();

          public int TotalExamination { get; set; }

          public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

     }
}
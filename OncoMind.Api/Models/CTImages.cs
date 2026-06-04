using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace OncoMind.Api.Models
{

    public enum TumorStatus
    {
        Unmarked,
        Shrinking,
        Stable,
        Growing,
        New
    }

    public enum ImageQuality
    {
        Poor,
        Acceptable,
        Good,
        Excellent
    }
    public class TumorPostTreat
    {
        public double X { get; set; }
        public double Y { get; set; }
        public double width { get; set; }
        public double height { get; set; }

        public TumorStatus Status { get; set; } = TumorStatus.Unmarked;
        public string? Note { get; set; }
    }
    public class CTImages
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public string? PatientId { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public string? AssignedDoctorId { get; set; }
        public string ImagePath { get; set; } = null!;

        public double? DignosedDiesease { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public string? PreviousScanId { get; set; }
        public List<TumorPostTreat> PostTreat { get; set; } = new();
        public string? DoctorNote { get; set; }
        public DateTime ScanDate { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
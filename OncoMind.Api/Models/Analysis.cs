using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace OncoMind.Api.Models
{
    public class Analysis
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public string PatientId { get; set; } = null!;

        public string AnalysisType { get; set; } = "CSV_DrugResponse"; // or "YOLO_Image"
        
        // Flexible field for ML results (JSON)
        public object ResultData { get; set; } = null!; 

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
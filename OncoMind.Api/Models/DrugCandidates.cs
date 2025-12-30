using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace OncoMind.Api.Models
{
     class DrugCandidates
     {
          [BsonId]
          [BsonRepresentation(BsonType.ObjectId)]
          public string? Id { get; set; }

          public string Smiles { get; set; } = null!;

          public double QedScore { get; set; }

          public double MwScore { get; set;} 

          public string MoleculeImage { get; set; }


          public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
     }
}
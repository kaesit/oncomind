using MongoDB.Driver;
using OncoMind.Api.Models;

namespace OncoMind.Api.Services
{
     public class MongoDbContext
     {
          private readonly IMongoDatabase _database;

          // The Configuration is injected automatically here!
          public MongoDbContext(IConfiguration config)
          {
               // 1. Get the string from Docker Environment variables
               // In Docker, this becomes "mongodb://mongo_db:27017"
               var connectionString = config["ConnectionStrings:Mongo"];

               // 2. Fallback for local debugging (outside Docker)
               if (string.IsNullOrEmpty(connectionString))
               {
                    connectionString = "mongodb://localhost:27017";
               }

               var mongoUrl = MongoUrl.Create(connectionString);
               var client = new MongoClient(mongoUrl);

               // 3. Connect to the specific database
               _database = client.GetDatabase("OncoMindDB");
          }

          // Expose your collections so Services can use them
          public IMongoCollection<Doctor> Doctors => _database.GetCollection<Doctor>("doctors");
          public IMongoCollection<Patient> Patients => _database.GetCollection<Patient>("patients");
          public IMongoCollection<Analysis> Analyses => _database.GetCollection<Analysis>("analyses");
          public IMongoCollection<DrugCandidates> DrugCandidates => _database.GetCollection<DrugCandidates>("drug_candidates");

     }
}
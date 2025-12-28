using MongoDB.Driver;
using OncoMind.Api.Models;

namespace OncoMind.Api.Services
{
     public class PatientService
     {
          private readonly MongoDbContext _context;

          public PatientService(MongoDbContext context)
          {
               _context = context;
          }

          public async Task<List<Patient>> GetAllAsync() =>
              await _context.Patients.Find(_ => true).ToListAsync();

          public async Task<List<Patient>> GetByDoctorIdAsync(string doctorId) =>
              await _context.Patients.Find(p => p.AssignedDoctorId == doctorId).ToListAsync();

          public async Task CreateAsync(Patient patient) =>
              await _context.Patients.InsertOneAsync(patient);

          public async Task<Patient?> GetByIdAsync(string id) =>
              await _context.Patients.Find(p => p.Id == id).FirstOrDefaultAsync();
     }
}
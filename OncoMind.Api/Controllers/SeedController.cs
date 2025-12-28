using Microsoft.AspNetCore.Mvc;
using OncoMind.Api.Models;
using OncoMind.Api.Services;
using MongoDB.Driver;

namespace OncoMind.Api.Controllers
{
     [ApiController]
     [Route("api/[controller]")]
     public class SeedController : ControllerBase
     {
          private readonly MongoDbContext _context;

          public SeedController(MongoDbContext context)
          {
               _context = context;
          }

          [HttpPost("run")]
          public async Task<IActionResult> SeedData()
          {
               // 1. Create Doctor
               var drHouse = new Doctor
               {
                    FirstName = "Gregory",
                    LastName = "House",
                    Email = "house@oncomind.com",
                    Specialization = "Diagnostician",
                    DateOfBirth = new DateTime(1959, 05, 15)
               };
               await _context.Doctors.InsertOneAsync(drHouse);

               // 2. Create Patient
               var patient = new Patient
               {
                    FirstName = "John",
                    LastName = "Doe",
                    Age = 35,
                    Gender = Gender.Male,
                    AssignedDoctorId = drHouse.Id,
                    EmergencyStatus = "Stable",
                    AdmissionLocation = "Room 221B",
                    TreatmentStartAt = DateTime.UtcNow.AddDays(-10)
               };
               // Note: We insert patient FIRST to get an ID
               await _context.Patients.InsertOneAsync(patient);

               // 3. Create a Dummy Analysis (Examination)
               var analysis = new Analysis
               {
                    PatientId = patient.Id, // Link to Patient
                    AnalysisType = "Blood Work",
                    Timestamp = DateTime.UtcNow.AddDays(-5),
                    ResultData = new { Summary = "Hemoglobin low", Ferritin = 12 } // Dummy JSON result
               };
               await _context.Analyses.InsertOneAsync(analysis);

               // 4. IMPORTANT: Update Patient to include this Analysis ID
               var update = Builders<Patient>.Update.Push(p => p.AnalysisIds, analysis.Id);
               await _context.Patients.UpdateOneAsync(p => p.Id == patient.Id, update);

               return Ok(new { Message = "Seeded: Doctor + Patient + 1 Analysis created!" });
          }
     }
}
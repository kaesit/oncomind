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

        public async Task CreateAsync(CreatePatientDto dto)
        {
            // Map DTO -> Database Entity
            var patient = new Patient
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Age = dto.Age,
                // Convert string "Male"/"Female" to Enum safely
                Gender = Enum.TryParse<Gender>(dto.Gender, true, out var g) ? g : Gender.Other,
                EmergencyStatus = dto.EmergencyStatus,
                ProfilePicture = dto.ProfilePicture,
                AdmissionLocation = dto.AdmissionLocation,
                AssignedDoctorId = dto.AssignedDoctorId,
                IsAdmitted = !string.IsNullOrEmpty(dto.AdmissionLocation), // Auto-logic
                CreatedAt = DateTime.UtcNow,
                TreatmentStartAt = DateTime.UtcNow
            };

            await _context.Patients.InsertOneAsync(patient);
        }

        public async Task CreateAsync(Patient patient) =>
            await _context.Patients.InsertOneAsync(patient);

        public async Task<Patient?> GetByIdAsync(string id) =>
            await _context.Patients.Find(p => p.Id == id).FirstOrDefaultAsync();

        public async Task<PatientDetailDto?> GetPatientWithHistoryAsync(string id)
        {
            // 1. Get the Patient
            var patient = await _context.Patients.Find(p => p.Id == id).FirstOrDefaultAsync();
            if (patient == null) return null;

            // 2. Get all Analyses belonging to this Patient
            var analyses = await _context.Analyses
                                         .Find(a => a.PatientId == id)
                                         .SortByDescending(a => a.Timestamp) // Newest first
                                         .ToListAsync();

            // 3. Combine them into the DTO
            return new PatientDetailDto
            {
                Id = patient.Id,
                FirstName = patient.FirstName,
                LastName = patient.LastName,
                Age = patient.Age,
                Gender = patient.Gender.ToString(), // Convert Enum to String here!
                EmergencyStatus = patient.EmergencyStatus,
                AdmissionLocation = patient.AdmissionLocation,
                TreatmentStartAt = patient.TreatmentStartAt,
                ProfilePicture = patient.ProfilePicture,
                Examinations = analyses // <--- The Real Data
            };
        }
    }
}
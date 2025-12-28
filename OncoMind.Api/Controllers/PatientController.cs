using Microsoft.AspNetCore.Mvc;
using OncoMind.Api.Models;
using OncoMind.Api.Services;

namespace OncoMind.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PatientController : ControllerBase
    {
        private readonly PatientService _patientService;

        public PatientController(PatientService patientService)
        {
            _patientService = patientService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _patientService.GetAllAsync());

        [HttpPost]
        public async Task<IActionResult> Create(Patient patient)
        {
            await _patientService.CreateAsync(patient);
            return CreatedAtAction(nameof(GetAll), new { id = patient.Id }, patient);
        }

        [HttpGet("doctor/{doctorId}")]
        public async Task<IActionResult> GetMyPatients(string doctorId)
        {
            var patient = await _patientService.GetByDoctorIdAsync(doctorId);
            return Ok(patient);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPatientDetails(string id)
        {
            var patientDto = await _patientService.GetPatientWithHistoryAsync(id);

            if (patientDto == null)
                return NotFound(new { Message = "Patient not found" });

            return Ok(patientDto);
        }
    }
}
using System.Security.Cryptography.X509Certificates;
using Microsoft.AspNetCore.Mvc;
using OncoMind.Api.Services;
using OncoMind.Api.Models;

namespace OncoMind.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnalysisController : ControllerBase
    {
        private readonly PythonMLService _mlService;
        private readonly PatientService _patientService;

        public AnalysisController(PythonMLService mlService, PatientService patientService)
        {
            _mlService = mlService;
            _patientService = patientService;
        }

        [HttpGet("dataset")]
        public async Task<IActionResult> GetDataset()
        {
            var csvData = await _mlService.GetDatasetCsvAsync();
            return Content(csvData, "text/csv");
        }

        [HttpGet("histogram")]
        public async Task<IActionResult> GetHistogram()
        {
            var imageStream = await _mlService.GetHistogramAsync();
            return File(imageStream, "image/png");
        }

        [HttpGet("parabol")]
        public async Task<IActionResult> GetParabol([FromQuery] double[] x, [FromQuery] double[] y)
        {
            var imageStream = await _mlService.GetParabolAsync(x, y);
            return File(imageStream, "image/png");
        }

        [HttpGet("scatter")]
        public async Task<IActionResult> GetScatter([FromQuery] double[] x, [FromQuery] double[] y)
        {
            var imageStream = await _mlService.GetScatterLineAsync(x, y);
            return File(imageStream, "image/png");
        }
        [HttpPost("add")]
        public async Task<IActionResult> AddNewAnalysis([FromBody] CreateAnalysisDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            // Call the Service
            await _patientService.CreateAnalysisAsync(dto);

            return Ok(new { Message = "Analysis record added successfully!" });
        }
    }
}
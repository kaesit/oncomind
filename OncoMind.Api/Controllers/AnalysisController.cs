using Microsoft.AspNetCore.Mvc;
using OncoMind.Api.Services;

namespace OncoMind.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnalysisController : ControllerBase
    {
        private readonly PythonMLService _mlService;

        public AnalysisController(PythonMLService mlService)
        {
            _mlService = mlService;
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
    }
}
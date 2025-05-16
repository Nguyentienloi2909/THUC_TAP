using CloudinaryDotNet;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MyProject.Dto;
using MyProject.Service.interfac;

namespace MyProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalaryController : ControllerBase
    {
        private readonly ISalaryService _salaryService;
        public SalaryController(ISalaryService salaryService)
        {
            _salaryService = salaryService;
        }

        [HttpGet("getSalarById")]
        public async Task<IActionResult> GetSalaryByUserId(
            [FromQuery] int userId,
            [FromQuery] int month,
            [FromQuery] int year)
        {
            try
            {
                var salaryDto = await _salaryService.CalculateSalaryByUserId(userId, month, year);
                return Ok(salaryDto);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("calculate-all")]
        public async Task<ActionResult<List<SalaryDto>>> CalculateAllUserSalaries(
            [FromQuery] int month,
            [FromQuery] int year)
        {
            // Validate input
            if (month < 1 || month > 12)
            {
                return BadRequest("Month must be between 1 and 12.");
            }

            if (year < 2000 || year > DateTime.Now.Year + 1)
            {
                return BadRequest("Year is invalid.");
            }
            try
            {
                var salaries = await _salaryService.CalculateAllUserSalaries(month, year);
                return Ok(salaries);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while calculating salaries: {ex.Message}");
            }
        }

        // API tính lương theo quý
        [HttpGet("quarter/{year}/{quarter}")]
        public async Task<ActionResult<List<SalaryDto>>> GetSalariesByQuarter(int year, int quarter)
        {
            if (quarter < 1 || quarter > 4)
            {
                return BadRequest("Quý không hợp lệ. Quý phải nằm trong khoảng từ 1 đến 4.");
            }

            try
            {
                var salaries = await _salaryService.CalculateSalariesByQuarter(year, quarter);
                return Ok(salaries);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Có lỗi khi tính lương: {ex.Message}");
            }
        }

        // API tính lương theo năm
        [HttpGet("year/{year}")]
        public async Task<ActionResult<List<SalaryDto>>> GetSalariesByYear(int year)
        {
            try
            {
                var salaries = await _salaryService.CalculateSalariesByYear(year);
                return Ok(salaries);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Có lỗi khi tính lương: {ex.Message}");
            }
        }
    }
}

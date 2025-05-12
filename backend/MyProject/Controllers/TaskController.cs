using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MyProject.Dto;
using MyProject.Service.interfac;

namespace MyProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        private readonly ITaskService _taskService;

        public TaskController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        [HttpPost]
        [Authorize(Policy = "LEADER")]
        public async Task<IActionResult> AddTask([FromForm] TaskItemDto request)
        {
            try
            {
                var result = await _taskService.AddTask(request);
                if (!result.IsSuccess)
                    return BadRequest(result.ErrorMessage);
                return Ok(result.response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error adding task: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "LEADER")]
        public async Task<IActionResult> UpdateTask(int id, [FromForm] TaskItemDto request)
        {
            try
            {
                var result = await _taskService.UpdateTask(id, request);
                if (!result.IsSuccess)
                    return BadRequest(result.ErrorMessage);
                return Ok(result.response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error updating task: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetTaskById(int id)
        {
            try
            {
                var task = await _taskService.GetTaskById(id);
                if (task == null)
                    return NotFound("Task not found");
                return Ok(task);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving task: {ex.Message}");
            }
        }

        [HttpGet("all")]
        [Authorize(Roles = "ADMIN, LEADER")]
        public async Task<IActionResult> GetAllTasks()
        {
            try
            {
                var tasks = await _taskService.GetAllTasks();
                return Ok(tasks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving tasks: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "LEADER, ADMIN")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            try
            {
                var success = await _taskService.DeleteTask(id);
                if (!success) return NotFound("Task not found or could not be deleted");
                return Ok("Task deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error deleting task: {ex.Message}");
            }
        }

        [HttpGet("user/{userId}")]
        [Authorize]
        public async Task<IActionResult> GetTasksByUserId(int userId)
        {
            try
            {
                var tasks = await _taskService.GetTasksByUserId(userId);
                return Ok(tasks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving tasks for user: {ex.Message}");
            }
        }
    }
}

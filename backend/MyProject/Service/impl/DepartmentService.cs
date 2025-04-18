using MyProject.Dto;
using MyProject.Service.interfac;
using MyProject.Utils;

namespace MyProject.Service.impl
{
    public class DepartmentService : IDepartmentService
    {
        private readonly ApplicationDbContext _dbContext;
        public DepartmentService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<DepartmentDto> CreateDepartment(DepartmentDto dto)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> DeleteDepartmentById(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<List<DepartmentDto>> GetAllDepartment()
        {
            throw new NotImplementedException();
        }

        public async Task<DepartmentDto?> GetDepartmentById(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<DepartmentDto> UpdateDepartmentById(int id, DepartmentDto dto)
        {
            throw new NotImplementedException();
        }
    }
}

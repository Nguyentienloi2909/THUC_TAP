using MyProject.Dto;

namespace MyProject.Service.interfac
{
    public interface IEmailService
    {
        Task SendEmailAsync(EmailRequest request);
    }
}

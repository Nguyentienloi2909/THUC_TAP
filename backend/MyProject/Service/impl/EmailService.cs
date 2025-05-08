using Microsoft.Extensions.Options;
using MimeKit;
using MyProject.Utils;
using MailKit.Net.Smtp;
using MyProject.Service.interfac;
using MyProject.Dto;

namespace MyProject.Service.impl
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _settings;
        public EmailService(IOptions<EmailSettings> settings)
        {
            _settings = settings.Value;
        }
        public async Task SendEmailAsync(EmailRequest request)
        {
            var email = new MimeMessage();
            email.From.Add(new MailboxAddress(_settings.SenderName, _settings.SenderEmail));
            email.To.Add(MailboxAddress.Parse(request.To));
            email.Subject = request.Subject;

            var bodyBuilder = new BodyBuilder
            {
                HtmlBody = request.Description // Nội dung HTML lấy từ Description
            };

            // Nếu có file đính kèm từ URL
            if (!string.IsNullOrEmpty(request.AttachmentUrl))
            {
                using var httpClient = new HttpClient();
                var fileBytes = await httpClient.GetByteArrayAsync(request.AttachmentUrl);
                var fileName = Path.GetFileName(new Uri(request.AttachmentUrl).LocalPath); // Tự lấy tên file nếu không truyền
                bodyBuilder.Attachments.Add(fileName, fileBytes);
            }

            email.Body = bodyBuilder.ToMessageBody();

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(_settings.SmtpServer, _settings.Port, MailKit.Security.SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(_settings.SenderEmail, _settings.Password);
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }

    }
}

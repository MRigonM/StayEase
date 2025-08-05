using StayEase.Application.Settings;
using StayEase.Domain.Interfaces.Services;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using MimeKit;
using System.Security.Cryptography.X509Certificates;
using System.Net.Security;

namespace StayEase.Application.Services
{
    public class MailService : IMailService
    {
        private readonly MailSettings _options;

        public MailService(IOptions<MailSettings> options)
        {
            _options = options.Value;
        }

        public async Task SendEmailAsync(string mailTo, string subject, string body, IList<IFormFile>? attachedFiles = null)
        {
            var email = new MimeMessage();
            email.Sender = MailboxAddress.Parse(_options.Email);
            email.To.Add(MailboxAddress.Parse(mailTo));
            email.Subject = subject;

            var builder = new BodyBuilder();

            if (attachedFiles != null)
            {
                byte[] fileBytes;
                foreach (var file in attachedFiles)
                {
                    if (file.Length > 0)
                    {
                        using var ms = new MemoryStream();
                        file.CopyTo(ms);
                        fileBytes = ms.ToArray();
                        builder.Attachments.Add(file.FileName, fileBytes, ContentType.Parse(file.ContentType));
                    }
                }
            }

            builder.HtmlBody = body;
            email.Body = builder.ToMessageBody();

            using var smtp = new SmtpClient();

            // Add this to bypass certificate revocation errors (dev only)
            smtp.ServerCertificateValidationCallback = (sender, certificate, chain, sslPolicyErrors) =>
            {
                if (sslPolicyErrors == SslPolicyErrors.None)
                    return true;

                if ((sslPolicyErrors & SslPolicyErrors.RemoteCertificateChainErrors) != 0)
                {
                    foreach (var status in chain.ChainStatus)
                    {
                        if (status.Status == X509ChainStatusFlags.RevocationStatusUnknown)
                            continue;
                        if (status.Status != X509ChainStatusFlags.NoError)
                            return false;
                    }
                    return true;
                }

                return false;
            };

            await smtp.ConnectAsync(_options.Host, _options.Port, SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(_options.Email, _options.Password);
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }
    }
}

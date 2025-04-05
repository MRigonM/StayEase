using System.ComponentModel.DataAnnotations;

namespace UserService.Application.DTOs;

public class RegisterRequest
{
    [Required][EmailAddress]
    public string Email { get; set; } = null!;
    [Required][StringLength(100, MinimumLength = 6)]
    public string Password { get; set; } = null!;
    [Required][StringLength(100, MinimumLength = 6)]
    public string ConfirmPassword { get; set; } = null!;
}
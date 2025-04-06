namespace UserService.Application.DTOs;

public class AuthResult
{
    public bool Success { get; set; }
    public string AccessToken { get; set; } = null!;
    public string RefreshToken { get; set; } = null!;
    public IEnumerable<string> Errors { get; set; } = new List<string>();
}
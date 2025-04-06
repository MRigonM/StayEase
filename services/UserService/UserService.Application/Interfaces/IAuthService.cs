namespace UserService.Application.Interfaces;

using UserService.Application.DTOs;

public interface IAuthService
{
    Task<AuthResult> RegisterAsync(RegisterRequest request);
    Task<AuthResult> LoginAsync(LoginRequest request);
    
    Task<AuthResult> RefreshTokenAsync(string refreshToken);
}

using UserService.Application.DTOs;
using UserService.Domain.Entities;

namespace UserService.Application.Interfaces;


public interface ITokenService
{
    Task<AuthResult> GenerateTokenAsync(ApplicationUser user);
    Task<AuthResult> RefreshTokenAsync(string refreshToken);
}
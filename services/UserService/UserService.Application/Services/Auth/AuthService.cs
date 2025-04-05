using Microsoft.AspNetCore.Identity;
using UserService.Application.Interfaces;
using UserService.Application.DTOs;
using UserService.Domain.Entities;

namespace UserService.Application.Services.Auth
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ITokenService _tokenService;

        public AuthService(UserManager<ApplicationUser> userManager, ITokenService tokenService)
        {
            _userManager = userManager;
            _tokenService = tokenService;
        }

        public async Task<AuthResult> RegisterAsync(RegisterRequest request)
        {
            var user = new ApplicationUser { UserName = request.Email, Email = request.Email };
            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
            {
                return new AuthResult
                {
                    Success = false,
                    Errors = result.Errors.Select(e => e.Description)
                };
            }

            return await _tokenService.GenerateTokenAsync(user);
        }

        public async Task<AuthResult> LoginAsync(LoginRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null || !(await _userManager.CheckPasswordAsync(user, request.Password)))
            {
                return new AuthResult
                {
                    Success = false,
                    Errors = new[] { "Invalid credentials" }
                };
            }

            return await _tokenService.GenerateTokenAsync(user);
        }
    }
}
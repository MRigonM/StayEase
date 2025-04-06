using Microsoft.AspNetCore.Mvc;
using UserService.Application.DTOs;
using UserService.Application.Interfaces;

namespace UserService.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }
        
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var authResult = await _authService.RegisterAsync(request);

            if (authResult.Success)
                return Ok(authResult);

            return BadRequest(authResult.Errors); // Return 400 if registration fails
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var authResult = await _authService.LoginAsync(request);

            if (authResult.Success)
                return Ok(authResult);

            return Unauthorized(authResult.Errors);
        }

        // POST: api/auth/refresh
        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken([FromBody] string refreshToken)
        {
            var authResult = await _authService.RefreshTokenAsync(refreshToken);

            if (authResult.Success)
                return Ok(authResult);

            return Unauthorized(authResult.Errors);
        }
    }
}
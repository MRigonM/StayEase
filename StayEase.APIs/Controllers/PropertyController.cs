using System.Net;
using System.Security.Claims;
using FluentValidation;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using StayEase.Domain;
using StayEase.Domain.DataTransferObjects.Property;
using StayEase.Domain.Identity;
using StayEase.Domain.Interfaces.Services;

namespace StayEase.APIs.Controllers
{
    public class PropertyController : APIBaseController
    {
        private readonly IPropertyService _propertyService;
        private readonly UserManager<AppUser> _userManager;
        private readonly IValidator<PropertyDTO> _propertyValidator;
        private readonly IValidator<PropertyToCreateDTO> _propertyToCreateValidator;

        public PropertyController(IPropertyService propertyService, 
                                  UserManager<AppUser> userManager, 
                                  IValidator<PropertyDTO> propertyValidator,
                                  IValidator<PropertyToCreateDTO> propertyToCreateValidator)
        {
            _propertyService = propertyService;
            _userManager = userManager;
            _propertyValidator = propertyValidator;
            _propertyToCreateValidator = propertyToCreateValidator;
        }

        [HttpGet("GetProperties")]
        public async Task<ActionResult<Responses>> GetAllProperties()
        {
            var response = await _propertyService.GetAllPropertiesAsync();
            return Ok(response);
        }

        [HttpGet("GetProperty")]
        public async Task<ActionResult<Responses>> GetPropertyById(string? propertyId)
        {
            if (propertyId is null) 
                return await Responses.FailurResponse(HttpStatusCode.BadRequest);

            var property = await _propertyService.GetPropertyByIdAsync(propertyId);
            return Ok(property);
        }

        //[Authorize(Roles = "Owner")]
        [HttpPost("CreateProperty")]
        public async Task<ActionResult<Responses>> CreateProperty([FromForm] PropertyToCreateDTO propertyDTO)
        {
            var validate = await _propertyToCreateValidator.ValidateAsync(propertyDTO);
            if (!validate.IsValid) 
                return await Responses.FailurResponse(validate.Errors, HttpStatusCode.BadRequest);

            var email = User.FindFirstValue(ClaimTypes.Email);
            if (email is null)
            {
                return await Responses.FailurResponse("Owner is not found, try again");
            }

            var createdProperty = await _propertyService.CreatePropertyAsync(email, propertyDTO);
            return Ok(Responses.SuccessResponse(createdProperty));
        }

        [HttpDelete("DeleteProperty")]
        public async Task<ActionResult<Responses>> DeleteProperty(string? propertyId)
        {
            if (propertyId is null) 
                return await Responses.FailurResponse(HttpStatusCode.BadRequest);

            var result = await _propertyService.DeletePropertyAsync(propertyId);
            return Ok(Responses.SuccessResponse(result));
        }

        [HttpPut("UpdateProperty")]
        public async Task<ActionResult<Responses>> UpdateProperty([FromQuery] string? propertyId, [FromQuery] PropertyToUpdateDTO propertyDTO)
        {
            if (propertyId is null) 
                return await Responses.FailurResponse(HttpStatusCode.BadRequest);

            return Ok(await _propertyService.UpdatePropertyAsync(propertyId, propertyDTO));
        }
    }
}
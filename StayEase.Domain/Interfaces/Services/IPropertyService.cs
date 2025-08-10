using StayEase.Domain.DataTransferObjects.Property;

namespace StayEase.Domain.Interfaces.Services
{
    public interface IPropertyService
    {
        Task<Responses> GetAllPropertiesAsync();
        Task<Responses> GetPropertyByIdAsync(string propertyId);
        Task<Responses> CreatePropertyAsync(string? email, PropertyToCreateDTO propertyDTO);
        Task<Responses> UpdatePropertyAsync(string propertyId, PropertyToUpdateDTO propertyDTO);
        Task<Responses> DeletePropertyAsync(string propertyId);

    }
}

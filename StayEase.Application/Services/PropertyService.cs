using StayEase.Domain;
using StayEase.Domain.DataTransferObjects.Property;
using StayEase.Domain.Interfaces.Services;

namespace StayEase.Application.Services;

public class PropertyService : IPropertyService
{
    public async Task<Responses> GetAllPropertiesAsync()
    {
        throw new NotImplementedException();
    }

    public async Task<Responses> GetPropertyByIdAsync(string propertyId)
    {
        throw new NotImplementedException();
    }

    public async Task<Responses> CreatePropertyAsync(string? email, PropertyToCreateDTO propertyDTO)
    {
        throw new NotImplementedException();
    }

    public async Task<Responses> UpdatePropertyAsync(string propertyId, PropertyToUpdateDTO propertyDTO)
    {
        throw new NotImplementedException();
    }

    public async Task<Responses> DeletePropertyAsync(string propertyId)
    {
        throw new NotImplementedException();
    }
}
using System.Net;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using StayEase.Application.Settings;
using StayEase.Application.Utility;
using StayEase.Domain;
using StayEase.Domain.DataTransferObjects.Property;
using StayEase.Domain.Entities;
using StayEase.Domain.Identity;
using StayEase.Domain.Interfaces.Repositories;
using StayEase.Domain.Interfaces.Services;

namespace StayEase.Application.Services;

public class PropertyService : IPropertyService
{
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly UserManager<AppUser> _userManager;

        public PropertyService(IUnitOfWork unitOfWork, UserManager<AppUser> userManager, IMapper mapper, IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
            _mapper = mapper;
            _configuration = configuration;
        }
        public async Task<Responses> CreatePropertyAsync(string? email, PropertyToCreateDTO propertyDTO)
        {
            var owner = await _userManager.FindByEmailAsync(email);

            var region = await _unitOfWork.Repository<Region, int>().GetByIdAsync(propertyDTO.Region.Id);
            if (region == null)
            {
                region = new Region { Name = propertyDTO.Region.Name };
                await _unitOfWork.Repository<Region, int>().AddAsync(region);
                if (await _unitOfWork.CompleteAsync() <= 0)
                    return await Responses.FailurResponse("Region is not valid data!",
                        HttpStatusCode.InternalServerError);
            }

            var country = await _unitOfWork.Repository<Country, int>().GetByIdAsync(propertyDTO.Country.Id);
            if (country == null)
            {
                country = new Country { Name = propertyDTO.Country.Name, RegionId = region.Id };
                await _unitOfWork.Repository<Country, int>().AddAsync(country);
                if (await _unitOfWork.CompleteAsync() <= 0)
                    return await Responses.FailurResponse("Country is not valid data!",
                        HttpStatusCode.InternalServerError);
            }

            var location = await _unitOfWork.Repository<Location, int>().GetByIdAsync(propertyDTO.Location.Id);
            if (location == null)
            {
                location = new Location { Name = propertyDTO.Location.Name, CountryId = country.Id };
                await _unitOfWork.Repository<Location, int>().AddAsync(location);
                if (await _unitOfWork.CompleteAsync() <= 0)
                    return await Responses.FailurResponse("Location is not valid data!",
                        HttpStatusCode.InternalServerError);
            }

            string propertyId = Guid.NewGuid().ToString();

            var property = new Property
            {
                Id = propertyId,
                Name = propertyDTO.Name,
                Description = propertyDTO.Description,
                NightPrice = propertyDTO.NightPrice.Value,
                PlaceType = propertyDTO.PlaceType,
                LocationId = location.Id,
                Owner = owner
            };

            await _unitOfWork.Repository<Property, string>().AddAsync(property);
            if (await _unitOfWork.CompleteAsync() <= 0)
                return await Responses.FailurResponse(HttpStatusCode.BadRequest);

            var images = new List<Image>();
            foreach (var img in propertyDTO.Images)
            {
                var imgName = await DocumentSettings.UploadFile(img, SD.Image, "Property");
                var url = _configuration["BaseUrl"] + $"{imgName}";
                images.Add(new Image { PropertyId = propertyId, Url = url });
            }

            await _unitOfWork.Repository<Image, int>().AddRangeAsync(images);

            var roomServices = propertyDTO.RoomServices
                .Select(rs => new RoomService
                {
                    PropertyId = propertyId,
                    Description = rs.Description
                }).ToList();

            await _unitOfWork.Repository<RoomService, int>().AddRangeAsync(roomServices);

            var propertyCategories = propertyDTO.Categories
                .Select(c => new PropertyCategory
                {
                    PropertyId = propertyId,
                    CategoryId = c.Id
                }).ToList();

            await _unitOfWork.Repository<PropertyCategory, int>().AddRangeAsync(propertyCategories);

            await _unitOfWork.CompleteAsync();

            return await Responses.SuccessResponse("Property has been created successfully!");
        }


    
        public async Task<Responses> DeletePropertyAsync(string propertyId)
        {
            var property = await _unitOfWork.Repository<Property, string>().GetByIdAsync(propertyId);
            if (property == null) return await Responses.FailurResponse("There is no property with this id");
            _unitOfWork.Repository<Property, string>().Remove(property);
            var Result = await _unitOfWork.CompleteAsync();
            if (Result <= 0) return await Responses.FailurResponse("Error has been occured while removing");
            return await Responses.SuccessResponse("Property has been deleted successfully!");
        }
        public async Task<Responses> GetAllPropertiesAsync()
        {
            var properties = await _unitOfWork
                .Repository<Property, string>()
                .GetAll()
                .Include(p => p.Images) 
                .ToListAsync();

            if (!properties.Any())
                return await Responses.FailurResponse("There are no properties found", 
                    System.Net.HttpStatusCode.NotFound);

            var mappedProperties = _mapper.Map<List<PropertyDTO>>(properties);

            for (int i = 0; i < properties.Count; i++)
            {
                mappedProperties[i].ImageUrls = properties[i].Images
                    .Select(img => img.Url)
                    .ToList();
            }

            return await Responses.SuccessResponse(mappedProperties);
        }
        
        public async Task<Responses> GetPropertyByIdAsync(string propertyId)
        {
            // there is a cycle when return the object
            var property = await _unitOfWork.Repository<Property, string>().GetByIdAsync(propertyId);
            if (property == null) return await Responses.FailurResponse("Property is not found!", System.Net.HttpStatusCode.NotFound);
            var MappedProperty = _mapper.Map<Property, PropertyDTO>(property);
            var imagesUrl = new List<string>();
            foreach(var img in property.Images)
            {
                imagesUrl.Add(img.Url);
            }
            MappedProperty.ImageUrls = imagesUrl;
            return await Responses.SuccessResponse(MappedProperty);
        }
        public async Task<Responses> UpdatePropertyAsync(string propertyId, PropertyToUpdateDTO propertyDTO)
        {
            var property = await _unitOfWork.Repository<Property, string>().GetByIdAsync(propertyId);
            if (property == null) return await Responses.FailurResponse("Property is not found!", System.Net.HttpStatusCode.NotFound);
            // if the item is null shouldn't change anything.
            if(propertyDTO.Name is not null)
            property.Name = propertyDTO.Name;
            if (propertyDTO.Description is not null)
            property.Description = propertyDTO.Description;
            if(propertyDTO.NightPrice > 0)
            property.NightPrice = propertyDTO.NightPrice;
            if(propertyDTO.PlaceType is not null)
            property.PlaceType = propertyDTO.PlaceType;
            if(propertyDTO.Location is not null)
            property.Location.Id = propertyDTO.Location.Id;
            if(propertyDTO.Owner is not null)
            property.Owner = await _userManager.FindByEmailAsync(propertyDTO.Owner.Email);
            //property.Images = propertyDTO.Images;
            //property.PropertyCategories = propertyDTO.Categories;

            _unitOfWork.Repository<Property, string>().Update(property);
            var Result = await _unitOfWork.CompleteAsync();
            if (Result <= 0) return await Responses.FailurResponse(System.Net.HttpStatusCode.InternalServerError);
            return await Responses.SuccessResponse("Property has been updated successfully!");
        }
}
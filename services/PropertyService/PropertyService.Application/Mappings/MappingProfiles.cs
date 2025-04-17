using AutoMapper;
using PropertyService.Domain.DTOs;
using PropertyService.Domain.Entities;

namespace PropertyService.Application.Mappings;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<Location, LocationDto>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name));

            CreateMap<Country,CountryDto>()
                .ForMember(dest=>dest.Name,opt=>opt.MapFrom(src=>src.Name));

            CreateMap<Category, CategoryDto>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name));

            CreateMap<PropertyCategory, CategoryDto>()
                 .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Category.Id))
                 .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Category.Name));

            CreateMap<RoomService, RoomServicesDto>()
                 .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Decscription));
                
            CreateMap<Image,ImageDto>()
                .ForMember(dest=>dest.Url,opt=>opt.MapFrom(opt=>opt.Url));
            
            CreateMap<Property, PropertyDTO>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
                .ForMember(dest => dest.NightPrice, opt => opt.MapFrom(src => src.NightPrice))
                .ForMember(dest => dest.PlaceType, opt => opt.MapFrom(src => src.PlaceType))
                .ForMember(dest => dest.Location, opt => opt.MapFrom(src => src.Location))
                .ForMember(dest => dest.Categories, opt => opt.MapFrom(src => src.PropertyCategories))
                .ForMember(dest => dest.RoomServices, opt => opt.MapFrom(src => src.RoomServices))
                .ForMember(dest => dest.Country, opt => opt.MapFrom(src => src.Location.Country));
            

            CreateMap<RoomServicesToCreateDTO, RoomService>()
            .ForMember(dest => dest.PropertyId, opt => opt.MapFrom(src => src.PropertyId))
            .ForMember(dest => dest.Decscription, opt => opt.MapFrom(src => src.Description));
    }
}
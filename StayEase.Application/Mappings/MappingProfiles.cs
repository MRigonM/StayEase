using AutoMapper;
using StayEase.Domain.DataTransferObjects;
using StayEase.Domain.Identity;

namespace StayEase.Application.Mappings;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<AppUser, OwnerDto>()
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FullName))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.PhoneNumber));
        
        CreateMap<RegisterDTO, AppUser>()
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => $"{src.FirstName} {src.MiddlName} {src.LastName}".Trim()))
            .ForMember(dest => dest.PasswordHash, opt => opt.MapFrom(src => src.Password));

    }
}
using StayEase.Domain.DataTransferObjects;
using StayEase.Domain.Identity;
using AutoMapper;
using Microsoft.Extensions.Configuration;

namespace StayEase.Application.Resolvers
{
    public class UserResolver : IValueResolver<AppUser, UserDTO, string>
    {
        private readonly IConfiguration _configuration;

        public UserResolver(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string Resolve(AppUser source, UserDTO destination, string destMember, ResolutionContext context)
        {
            string Url = string.Empty;
            if(source.ProfileImage is not null)
            {
                Url = $"{_configuration["BaseUrl"]}{source.ProfileImage}";
            }
            return Url;
        }
    }
}

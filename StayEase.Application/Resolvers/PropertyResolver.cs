using AutoMapper;
using Microsoft.Extensions.Configuration;
using StayEase.Domain.DataTransferObjects.Property;
using StayEase.Domain.Entities;

namespace StayEase.Application.Resolvers
{
    public class PropertyResolver : IValueResolver<Property, PropertyDTO, List<string>>
    {
        private readonly IConfiguration _configuration;

        public PropertyResolver(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public List<string> Resolve(Property source, PropertyDTO destination, List<string> destMember, ResolutionContext context)
        {
            var Urls = new List<string>();
            if (source.Images != null && source.Images.Any())
            {
                foreach (var image in source.Images)
                {
                    if (!string.IsNullOrEmpty(image.Url))
                    {
                        var imageUrl = $"{_configuration["BaseUrl"]}{image.Url}";
                        Urls.Add(imageUrl);
                    }
                }
            }
            return Urls;
        }
    }

}

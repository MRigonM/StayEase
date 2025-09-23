using Microsoft.AspNetCore.Mvc;
using OpenAI.GPT3;
using OpenAI.GPT3.Managers;
using OpenAI.GPT3.ObjectModels;
using OpenAI.GPT3.ObjectModels.RequestModels;
using StayEase.Domain.Entities;
using StayEase.Domain.Interfaces.Services;
using System.Text.Json;

namespace StayEase.APIs.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FiltersController : ControllerBase
    {
        private readonly OpenAIService _service;
        private readonly IPropertyService _propertyService;

        public FiltersController(IConfiguration config, IPropertyService propertyService)
        {
            var apiKey = config["OpenAI:ApiKey"];
            _service = new OpenAIService(new OpenAiOptions { ApiKey = apiKey });
            _propertyService = propertyService;
        }

       [HttpPost("ParseAndFilter")]
public async Task<IActionResult> ParseAndFilter([FromBody] FilterRequest request)
{
    if (string.IsNullOrWhiteSpace(request.Query))
        return BadRequest("Query is required.");

    // 1️⃣ Kërko filters nga OpenAI
    var completion = await _service.ChatCompletion.CreateCompletion(new ChatCompletionCreateRequest
    {
        Model = Models.Gpt_4,
        Temperature = 0,
        Messages = new List<ChatMessage>
        {
            new ChatMessage("system",
                @"You are a filter parser for a property search app. 
                Extract filters ONLY as valid JSON with fields:
                {
                  ""minPrice"": number or null,
                  ""maxPrice"": number or null,
                  ""location"": string or null,
                  ""type"": string or null,
                  ""ratingMin"": number or null
                }"),
            new ChatMessage("user", request.Query)
        }
    });

    if (completion == null || completion.Choices == null || !completion.Choices.Any())
        return BadRequest("No response from AI");

    var content = completion.Choices.First().Message.Content;

    PropertyFilters filters;
    try
    {
        filters = JsonSerializer.Deserialize<PropertyFilters>(content);
    }
    catch
    {
        return BadRequest("AI did not return valid filters.");
    }

    // 2️⃣ Merr pronat nga DB
    var response = await _propertyService.GetAllPropertiesAsync();
    if (response.Data == null)
        return Ok(new List<Property>());

    // Cast Data në listë properties
    var properties = response.Data as IEnumerable<Property>;
    if (properties == null)
        return Ok(new List<Property>());

    var filtered = properties;

    // 3️⃣ Apliko filtrat
    if (!string.IsNullOrEmpty(filters.Type))
        filtered = filtered.Where(p =>
            !string.IsNullOrEmpty(p.PlaceType) &&
            p.PlaceType.ToLower().Contains(filters.Type.ToLower()));

    if (!string.IsNullOrEmpty(filters.Location))
        filtered = filtered.Where(p =>
            p.Location != null &&
            p.Location.Name.ToLower().Contains(filters.Location.ToLower()));

    if (filters.MinPrice.HasValue)
        filtered = filtered.Where(p => p.NightPrice >= filters.MinPrice.Value);

    if (filters.MaxPrice.HasValue)
        filtered = filtered.Where(p => p.NightPrice <= filters.MaxPrice.Value);

    if (filters.RatingMin.HasValue)
        filtered = filtered.Where(p => p.Reviews != null &&
                                       p.Reviews.Any() &&
                                       p.Reviews.Average(r => r.Stars) >= filters.RatingMin.Value);

    // 4️⃣ Kthe rezultatet
    return Ok(filtered.ToList());
}
    }

    public class FilterRequest
    {
        public string Query { get; set; } = string.Empty;
    }

    public class PropertyFilters
    {
        public int? MinPrice { get; set; }
        public int? MaxPrice { get; set; }
        public string? Location { get; set; }
        public string? Type { get; set; }
        public double? RatingMin { get; set; }
    }
}

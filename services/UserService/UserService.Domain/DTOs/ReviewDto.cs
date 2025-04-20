namespace UserService.Domain.DTOs;

public class ReviewDto
{
    public string Comment { get; set; } = string.Empty;
    public int Stars { get; set; }
    public string PropertyId { get; set; }
}
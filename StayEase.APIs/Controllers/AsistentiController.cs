using Microsoft.AspNetCore.Mvc;
using StayEase.Domain.Entities.Enti;
using StayEase.Domain.Interfaces.Services.Servi;

namespace StayEase.APIs.Controllers;

public class AsistentiController : APIBaseController
{
    private readonly IAsistentiService _asistentiService;

    public AsistentiController(IAsistentiService asistentiService)
    {
        _asistentiService = asistentiService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? departamentiId)
    {
        var members = await _asistentiService.GetAllAsync();

        if (departamentiId.HasValue)
            members = members.Where(m => m.DepartamentiId == departamentiId.Value);

        return Ok(members);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var member = await _asistentiService.GetByIdAsync(id);
        if (member == null) return NotFound();
        return Ok(member);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Asistenti asistenti)
    {
        var created = await _asistentiService.CreateAsync(asistenti);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, Asistenti asistenti)
    {
        if (id != asistenti.Id) return BadRequest();
        await _asistentiService.UpdateAsync(asistenti);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _asistentiService.DeleteAsync(id);
        return NoContent();
    }
}
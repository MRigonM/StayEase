using Microsoft.AspNetCore.Mvc;
using StayEase.Domain.Entities.Enti;
using StayEase.Domain.Interfaces.Services.Servi;

namespace StayEase.APIs.Controllers;

public class DepartamentiController : APIBaseController
{
    private readonly IDepartamentiService _departamentiService;

    public DepartamentiController(IDepartamentiService departamentiService)
    {
        _departamentiService = departamentiService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var groups = await _departamentiService.GetAllAsync();
        return Ok(groups);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var group = await _departamentiService.GetByIdAsync(id);
        if (group == null) return NotFound();
        return Ok(group);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Departamenti departamenti)
    {
        var created = await _departamentiService.CreateAsync(departamenti);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, Departamenti departamenti)
    {
        if (id != departamenti.Id) return BadRequest();
        await _departamentiService.UpdateAsync(departamenti);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _departamentiService.DeleteAsync(id);
        return NoContent();
    }
}
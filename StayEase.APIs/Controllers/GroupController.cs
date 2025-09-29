using Microsoft.AspNetCore.Mvc;
using StayEase.Domain.Entities.Enti;
using StayEase.Domain.Interfaces.Services.Servi;

namespace StayEase.APIs.Controllers;

public class GroupController : APIBaseController
{
    private readonly IGroupService _groupService;

    public GroupController(IGroupService groupService)
    {
        _groupService = groupService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var groups = await _groupService.GetAllAsync();
        return Ok(groups);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var group = await _groupService.GetByIdAsync(id);
        if (group == null) return NotFound();
        return Ok(group);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Group group)
    {
        var created = await _groupService.CreateAsync(group);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, Group group)
    {
        if (id != group.Id) return BadRequest();
        await _groupService.UpdateAsync(group);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _groupService.DeleteAsync(id);
        return NoContent();
    }
}
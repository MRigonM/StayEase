using Microsoft.AspNetCore.Mvc;
using StayEase.Domain.Entities.Enti;
using StayEase.Domain.Interfaces.Services.Servi;

namespace StayEase.APIs.Controllers;

public class MembersController : APIBaseController
{
    private readonly IMemberService _memberService;

    public MembersController(IMemberService memberService)
    {
        _memberService = memberService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var members = await _memberService.GetAllAsync();
        return Ok(members);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var member = await _memberService.GetByIdAsync(id);
        if (member == null) return NotFound();
        return Ok(member);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Member member)
    {
        var created = await _memberService.CreateAsync(member);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, Member member)
    {
        if (id != member.Id) return BadRequest();
        await _memberService.UpdateAsync(member);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _memberService.DeleteAsync(id);
        return NoContent();
    }
}
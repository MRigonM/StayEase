using StayEase.Domain.Entities.Enti;
using StayEase.Domain.Interfaces.Repositories;
using StayEase.Domain.Interfaces.Services.Servi;

namespace StayEase.Application.Services.Servi;

public class MemberService : GenericService<Member, int>, IMemberService
{
    public MemberService(IGenericRepository<Member, int> repo, IUnitOfWork uow)
        : base(repo, uow) { }
}

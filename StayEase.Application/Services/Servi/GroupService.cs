using StayEase.Domain.Entities.Enti;
using StayEase.Domain.Interfaces.Repositories;
using StayEase.Domain.Interfaces.Services.Servi;

namespace StayEase.Application.Services.Servi;

public class GroupService : GenericService<Group, int>, IGroupService
{
    public GroupService(IGenericRepository<Group, int> repo, IUnitOfWork uow)
        : base(repo, uow) { }
}

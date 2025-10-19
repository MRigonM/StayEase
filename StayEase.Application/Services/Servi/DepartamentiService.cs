using StayEase.Domain.Entities.Enti;
using StayEase.Domain.Interfaces.Repositories;
using StayEase.Domain.Interfaces.Services.Servi;

namespace StayEase.Application.Services.Servi;

public class DepartamentiService : GenericService<Departamenti, int>, IDepartamentiService
{
    public DepartamentiService(IGenericRepository<Departamenti, int> repo, IUnitOfWork uow)
        : base(repo, uow) { }
}

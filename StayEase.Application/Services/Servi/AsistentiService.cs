using StayEase.Domain.Entities.Enti;
using StayEase.Domain.Interfaces.Repositories;
using StayEase.Domain.Interfaces.Services.Servi;

namespace StayEase.Application.Services.Servi;

public class AsistentiService : GenericService<Asistenti, int>, IAsistentiService
{
    public AsistentiService(IGenericRepository<Asistenti, int> repo, IUnitOfWork uow)
        : base(repo, uow) { }
}

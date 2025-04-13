namespace PropertyService.Domain.Interfaces.Repositories;

public interface IUnitOfWork:IDisposable
{
    IGenericRepository<TEntity, TKey> Repository<TEntity, TKey>() where TEntity : BaseEntity<TKey>;
    Task<int> CompleteAsync();
}
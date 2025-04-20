using System.Linq.Expressions;

namespace PropertyService.Domain.Interfaces.Repositories;

public interface IGenericRepository<TEntity,TKey> where TEntity : BaseEntity<TKey>
{
    Task<IEnumerable<TEntity>>? GetAllAsync();
    Task<TEntity>? GetByIdAsync(TKey id);
    Task AddAsync(TEntity entity);
    Task AddRangeAsync(IEnumerable<TEntity> entities);
    void UpdateRange(IEnumerable<TEntity> entities);
    void Update(TEntity entity);
    void Remove(TEntity entity);
}
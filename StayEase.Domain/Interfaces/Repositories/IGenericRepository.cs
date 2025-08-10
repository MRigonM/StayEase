using System.Linq.Expressions;
using StayEase.Domain.Entities;

namespace StayEase.Domain.Interfaces.Repositories
{
    public interface IGenericRepository<TEntity,TKey> where TEntity : BaseEntity<TKey>
    {
        #region Without Specification
        Task<IEnumerable<TEntity>>? GetAllAsync();
        Task<TEntity>? GetByIdAsync(TKey id);
        #endregion

        #region With Specification
        Task<IReadOnlyList<TEntity>>? GetAllWithSpecAsync(ISpecifications<TEntity, TKey> spec);
        Task<TEntity>? GetEntityWithSpecAsync(ISpecifications<TEntity, TKey> spec);
        #endregion

        Task AddAsync(TEntity entity);
        Task AddRangeAsync(IEnumerable<TEntity> entities);
        void UpdateRange(IEnumerable<TEntity> entities);
        Task<bool> CheckAvailabilityAsync(Expression<Func<Booking, bool>> expression, DateTimeOffset startDate, DateTimeOffset endDate);
        void Update(TEntity entity);
        void Remove(TEntity entity);
    }
}

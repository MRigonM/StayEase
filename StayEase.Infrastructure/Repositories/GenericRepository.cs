using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using StayEase.Domain;
using StayEase.Domain.Entities;
using StayEase.Domain.Interfaces.Repositories;
using StayEase.Infrastructure.Data;
using StayEase.Infrastructure.Specifications;

namespace StayEase.Infrastructure.Repositories
{
    public class GenericRepository<TEntity, TKey> : IGenericRepository<TEntity, TKey> where TEntity : BaseEntity<TKey>
    {
        private readonly AppDbContext _context;
        private readonly DbSet<TEntity> _dbSet;

        public GenericRepository(AppDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<TEntity>();
        }

        public async Task AddAsync(TEntity entity)
           => await _dbSet.AddAsync(entity);

        public async Task AddRangeAsync(IEnumerable<TEntity> entities)
          => await _dbSet.AddRangeAsync(entities);

        public void Remove(TEntity entity)
           => _dbSet.Remove(entity);


        public async Task<IEnumerable<TEntity>>? GetAllAsync()
          => await _dbSet.ToListAsync();


        public async Task<TEntity>? GetByIdAsync(TKey id)
          => (await _dbSet.FindAsync(id))!;


        public void Update(TEntity entity)
          => _dbSet.Update(entity);

        public void UpdateRange(IEnumerable<TEntity> entities)
         => _dbSet.UpdateRange(entities);

        public async Task<IReadOnlyList<TEntity>>? GetAllWithSpecAsync(ISpecifications<TEntity, TKey> spec)
        {
            return await ApplySpecification(spec).ToListAsync();
        }

        public async Task<TEntity>? GetEntityWithSpecAsync(ISpecifications<TEntity, TKey> spec)
        {
            return await ApplySpecification(spec).FirstOrDefaultAsync();
        }

        private IQueryable<TEntity> ApplySpecification(ISpecifications<TEntity, TKey> Spec)
        {
            return SpecificationEvaluator<TEntity, TKey>.GetQuery(_context.Set<TEntity>(), Spec);
        }

        public async Task<bool> CheckAvailabilityAsync(Expression<Func<Booking, bool>> expression, DateTimeOffset startDate, DateTimeOffset endDate)
        {
            return !await _context.Bookings
            .Where(expression)
            .AnyAsync(b =>
              (b.EndDate <= endDate && b.EndDate >= startDate) ||
              (b.StartDate <= endDate && b.StartDate >= startDate));
        }
    }
}

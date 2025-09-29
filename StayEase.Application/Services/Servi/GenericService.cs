using Microsoft.EntityFrameworkCore;
using StayEase.Domain;
using StayEase.Domain.Interfaces.Repositories;
using StayEase.Domain.Interfaces.Services.Servi;

namespace StayEase.Application.Services.Servi
{
    public class GenericService<TEntity, TKey> : IGenericService<TEntity, TKey> 
        where TEntity : BaseEntity<TKey>
    {
        private readonly IGenericRepository<TEntity, TKey> _repository;
        private readonly IUnitOfWork _unitOfWork;

        public GenericService(IGenericRepository<TEntity, TKey> repository, IUnitOfWork unitOfWork)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<TEntity>> GetAllAsync()
        {
            return await _repository.GetAll().ToListAsync();
        }

        public async Task<TEntity?> GetByIdAsync(TKey id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<TEntity> CreateAsync(TEntity entity)
        {
            await _repository.AddAsync(entity);
            await _unitOfWork.CompleteAsync();
            return entity;
        }

        public async Task UpdateAsync(TEntity entity)
        {
            _repository.Update(entity);
            await _unitOfWork.CompleteAsync();
        }

        public async Task DeleteAsync(TKey id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity is null) throw new KeyNotFoundException($"{typeof(TEntity).Name} not found");

            _repository.Remove(entity);
            await _unitOfWork.CompleteAsync();
        }
    }
}
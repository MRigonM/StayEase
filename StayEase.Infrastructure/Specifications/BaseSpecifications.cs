using System.Linq.Expressions;
using StayEase.Domain;
using StayEase.Domain.Interfaces.Repositories;

namespace StayEase.Infrastructure.Specifications
{
    public class BaseSpecifications<TEntity, TKey> : ISpecifications<TEntity, TKey> where TEntity : BaseEntity<TKey>
    {
        public Expression<Func<TEntity, bool>> Criteria { get; set; }
        public List<Expression<Func<TEntity, object>>> Includes { get; set; } = new List<Expression<Func<TEntity, object>>> ();
        public Expression<Func<TEntity, object>> OrderBy { get; set; }
        public Expression<Func<TEntity, object>> OrderByDescending { get; set; }
        public int Take { get; set; }
        public int Skip { get; set; }
        public bool IsPaginationEnabled { get; set; }

        public BaseSpecifications()
        {
            
        }
        public BaseSpecifications(Expression<Func<TEntity, bool>> CriteriaExpression)
        {
            Criteria = CriteriaExpression;   
        }

        public void AddOrderBy(Expression<Func<TEntity, object>> OrderByExpression)
        {
            OrderBy = OrderByExpression;
        }

        public void AddOrderByDescending(Expression<Func<TEntity, object>> OrderByDescendingExpression)
        {
            OrderByDescending = OrderByDescendingExpression;
        }

        public void ApplyPagination(int skip, int take)
        {
            Take = take;
            Skip = skip;
            IsPaginationEnabled = true;
        }
    }
}

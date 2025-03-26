using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TuneYourMood.Core.InterfaceRepository
{
    public interface IRepository<T>
    {
        Task<IEnumerable<T>> GetAsync();

        Task<T>? GetByIdAsync(int id);

        Task<T> AddAsync(T entity);

        Task<T> UpdateAsync(int id, T entity);

        Task<bool> DeleteAsync(int id);
    }
}

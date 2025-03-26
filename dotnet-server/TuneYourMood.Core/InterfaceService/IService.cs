using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TuneYourMood.Core.InterfaceService
{
    public interface IService<T>
    {
        Task<IEnumerable<T>> getallAsync();

        Task<T>? getByIdAsync(int id);

        Task<T> addAsync(T item);

        Task<T> updateAsync(int id, T item);

        Task<bool> deleteAsync(int id);
    }
}

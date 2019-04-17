using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SportsStore.Models;
using SportsStore.Models.BindingTargets;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SportsStore.Controllers
{
    [Route("api/suppliers")]
    public class SupplierValuesController : Controller
    {
        private DataContext context;

        public SupplierValuesController(DataContext ctx) => context = ctx;

        [HttpGet]
        public IEnumerable<Supplier> GetSuppliers()
        {
            return context.Suppliers;
        }

        [HttpPost]
        public IActionResult CreateSupplier([FromBody] SupplierData sdata)
        {
            if (ModelState.IsValid)
            {
                Supplier s = sdata.Supplier;
                context.Add(s);
                context.SaveChanges();
                return Ok(s.SupplierId);
            }
            return BadRequest(ModelState);
        }

        [HttpPut("{id}")]
        public IActionResult ReplaceSupplier(long id, [FromBody] SupplierData sdata)
        {
            if (ModelState.IsValid)
            {
                Supplier s = sdata.Supplier;
                s.SupplierId = id;
                context.Update(s);
                context.SaveChanges();
                return Ok();
            }
            return BadRequest(ModelState);
        }

        [HttpDelete("{id}")]
        public void DeleteSupplier(long id)
        {
            context.Suppliers.Remove(new Supplier { SupplierId = id });
            context.SaveChanges();
        }
    }
}

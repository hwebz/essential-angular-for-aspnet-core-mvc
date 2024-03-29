﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SportsStore.Models.BindingTargets
{
    public class ProductData
    {
        [Required]
        public string Name { get => Product.Name; set => Product.Name = value; }

        [Required]
        public string Category { get => Product.Category; set => Product.Category = value; }

        [Required]
        public string Description { get => Product.Description; set => Product.Description = value; }

        [Range(1, int.MaxValue, ErrorMessage = "Price must be at least 1")]
        public decimal Price { get => Product.Price; set => Product.Price = value; }
        
        public long? Supplier {
            get => Product.Supplier?.SupplierId ?? null;
            set {
                if (!value.HasValue)
                {
                    Product.Supplier = null;
                } else
                {
                    if (Product.Supplier == null)
                    {
                        Product.Supplier = new Supplier();
                    }
                    Product.Supplier.SupplierId = value.Value;
                }
            }
        }
        //public Product Product => new Product
        //{
        //    Name = Name,
        //    Category = Category,
        //    Description = Description,
        //    Price = Price,
        //    Supplier = Supplier == 0 ? null : new Supplier { SupplierId = Supplier }
        //};
        public Product Product { get; set; } = new Product();
    }
}

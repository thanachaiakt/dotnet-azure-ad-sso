using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProductStoreApi.Data;
using ProductStoreApi.Models;

namespace ProductStoreApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProductsController : ControllerBase
{
    /// <summary>
    /// GET /api/products
    /// Supports query string filtering: name, category, brand, minPrice, maxPrice, inStock
    /// </summary>
    [HttpGet]
    public ActionResult<IEnumerable<Product>> GetProducts(
        [FromQuery] string? name,
        [FromQuery] string? category,
        [FromQuery] string? brand,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] bool? inStock)
    {
        IEnumerable<Product> products = MockProductData.Products;

        if (!string.IsNullOrWhiteSpace(name))
        {
            products = products.Where(p =>
                p.Name.Contains(name, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrWhiteSpace(category))
        {
            products = products.Where(p =>
                p.Category.Equals(category, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrWhiteSpace(brand))
        {
            products = products.Where(p =>
                p.Brand.Equals(brand, StringComparison.OrdinalIgnoreCase));
        }

        if (minPrice.HasValue)
        {
            products = products.Where(p => p.Price >= minPrice.Value);
        }

        if (maxPrice.HasValue)
        {
            products = products.Where(p => p.Price <= maxPrice.Value);
        }

        if (inStock.HasValue)
        {
            products = products.Where(p => p.InStock == inStock.Value);
        }

        return Ok(products.ToList());
    }

    /// <summary>
    /// GET /api/products/{id}
    /// </summary>
    [HttpGet("{id:int}")]
    public ActionResult<Product> GetProduct(int id)
    {
        var product = MockProductData.Products.FirstOrDefault(p => p.Id == id);

        if (product is null)
        {
            return NotFound(new { message = $"Product with ID {id} not found." });
        }

        return Ok(product);
    }

    /// <summary>
    /// GET /api/products/categories
    /// Returns all distinct categories
    /// </summary>
    [HttpGet("categories")]
    public ActionResult<IEnumerable<string>> GetCategories()
    {
        return Ok(MockProductData.GetCategories());
    }

    /// <summary>
    /// GET /api/products/brands
    /// Returns all distinct brands
    /// </summary>
    [HttpGet("brands")]
    public ActionResult<IEnumerable<string>> GetBrands()
    {
        return Ok(MockProductData.GetBrands());
    }
}

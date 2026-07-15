using Microsoft.AspNetCore.Mvc;
using ProductStoreApi.Controllers;
using ProductStoreApi.Data;
using ProductStoreApi.Models;
using Xunit;

namespace ProductStoreApi.Tests
{
    public class ProductsControllerTests
    {
        private readonly ProductsController _controller;

        public ProductsControllerTests()
        {
            _controller = new ProductsController();
        }

        [Fact]
        public void GetProducts_ReturnsAllProducts_WhenNoFiltersProvided()
        {
            // Act
            var result = _controller.GetProducts(null, null, null, null, null, null);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var products = Assert.IsAssignableFrom<IEnumerable<Product>>(okResult.Value);
            Assert.Equal(MockProductData.Products.Count, products.Count());
        }

        [Theory]
        [InlineData("macbook")]
        [InlineData("MacBook")]
        [InlineData("PRO")]
        public void GetProducts_FiltersByName_CaseInsensitive(string nameFilter)
        {
            // Act
            var result = _controller.GetProducts(nameFilter, null, null, null, null, null);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var products = Assert.IsAssignableFrom<IEnumerable<Product>>(okResult.Value);
            
            var expectedCount = MockProductData.Products.Count(p => 
                p.Name.Contains(nameFilter, StringComparison.OrdinalIgnoreCase));
            
            Assert.Equal(expectedCount, products.Count());
            Assert.All(products, p => Assert.Contains(nameFilter, p.Name, StringComparison.OrdinalIgnoreCase));
        }

        [Fact]
        public void GetProducts_FiltersByCategory()
        {
            // Arrange
            var category = "Headphones";

            // Act
            var result = _controller.GetProducts(null, category, null, null, null, null);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var products = Assert.IsAssignableFrom<IEnumerable<Product>>(okResult.Value);
            
            var expectedCount = MockProductData.Products.Count(p => 
                p.Category.Equals(category, StringComparison.OrdinalIgnoreCase));
            
            Assert.Equal(expectedCount, products.Count());
            Assert.All(products, p => Assert.Equal(category, p.Category, ignoreCase: true));
        }

        [Fact]
        public void GetProducts_FiltersByBrand()
        {
            // Arrange
            var brand = "Apple";

            // Act
            var result = _controller.GetProducts(null, null, brand, null, null, null);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var products = Assert.IsAssignableFrom<IEnumerable<Product>>(okResult.Value);
            
            var expectedCount = MockProductData.Products.Count(p => 
                p.Brand.Equals(brand, StringComparison.OrdinalIgnoreCase));
            
            Assert.Equal(expectedCount, products.Count());
            Assert.All(products, p => Assert.Equal(brand, p.Brand, ignoreCase: true));
        }

        [Fact]
        public void GetProducts_FiltersByMinPrice()
        {
            // Arrange
            decimal minPrice = 1000m;

            // Act
            var result = _controller.GetProducts(null, null, null, minPrice, null, null);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var products = Assert.IsAssignableFrom<IEnumerable<Product>>(okResult.Value);
            
            var expectedCount = MockProductData.Products.Count(p => p.Price >= minPrice);
            
            Assert.Equal(expectedCount, products.Count());
            Assert.All(products, p => Assert.True(p.Price >= minPrice));
        }

        [Fact]
        public void GetProducts_FiltersByMaxPrice()
        {
            // Arrange
            decimal maxPrice = 500m;

            // Act
            var result = _controller.GetProducts(null, null, null, null, maxPrice, null);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var products = Assert.IsAssignableFrom<IEnumerable<Product>>(okResult.Value);
            
            var expectedCount = MockProductData.Products.Count(p => p.Price <= maxPrice);
            
            Assert.Equal(expectedCount, products.Count());
            Assert.All(products, p => Assert.True(p.Price <= maxPrice));
        }

        [Theory]
        [InlineData(true)]
        [InlineData(false)]
        public void GetProducts_FiltersByInStock(bool inStock)
        {
            // Act
            var result = _controller.GetProducts(null, null, null, null, null, inStock);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var products = Assert.IsAssignableFrom<IEnumerable<Product>>(okResult.Value);
            
            var expectedCount = MockProductData.Products.Count(p => p.InStock == inStock);
            
            Assert.Equal(expectedCount, products.Count());
            Assert.All(products, p => Assert.Equal(inStock, p.InStock));
        }

        [Fact]
        public void GetProduct_ReturnsProduct_WhenIdExists()
        {
            // Arrange
            int targetId = 1;
            var expectedProduct = MockProductData.Products.First(p => p.Id == targetId);

            // Act
            var result = _controller.GetProduct(targetId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var product = Assert.IsType<Product>(okResult.Value);
            Assert.Equal(expectedProduct.Id, product.Id);
            Assert.Equal(expectedProduct.Name, product.Name);
        }

        [Fact]
        public void GetProduct_ReturnsNotFound_WhenIdDoesNotExist()
        {
            // Arrange
            int nonExistentId = 99999;

            // Act
            var result = _controller.GetProduct(nonExistentId);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result.Result);
            // The controller returns anonymous object with message property
            // We can check if it returns a 404
            Assert.Equal(404, notFoundResult.StatusCode);
        }

        [Fact]
        public void GetCategories_ReturnsDistinctCategories()
        {
            // Act
            var result = _controller.GetCategories();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var categories = Assert.IsAssignableFrom<IEnumerable<string>>(okResult.Value);
            
            var expectedCategories = MockProductData.GetCategories();
            Assert.Equal(expectedCategories, categories);
        }

        [Fact]
        public void GetBrands_ReturnsDistinctBrands()
        {
            // Act
            var result = _controller.GetBrands();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var brands = Assert.IsAssignableFrom<IEnumerable<string>>(okResult.Value);
            
            var expectedBrands = MockProductData.GetBrands();
            Assert.Equal(expectedBrands, brands);
        }
    }
}

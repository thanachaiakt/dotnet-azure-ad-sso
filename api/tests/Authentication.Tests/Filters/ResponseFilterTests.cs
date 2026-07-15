using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Routing;
using authentication.Filters;
using authentication.Models;
using Xunit;

namespace Authentication.Tests.Filters
{
    public class ResponseFilterTests
    {
        [Fact]
        public async Task OnResultExecutionAsync_WrapsObjectResult_InSuccessResponse()
        {
            // Arrange
            var filter = new ResponseFilter();
            
            var httpContext = new DefaultHttpContext();
            var actionContext = new ActionContext(httpContext, new RouteData(), new ActionDescriptor());
            
            var originalValue = new { Name = "Test" };
            var objectResult = new OkObjectResult(originalValue);
            
            var resultExecutingContext = new ResultExecutingContext(
                actionContext,
                new List<IFilterMetadata>(),
                objectResult,
                new object()
            );

            bool nextCalled = false;
            ResultExecutionDelegate next = () =>
            {
                nextCalled = true;
                return Task.FromResult(new ResultExecutedContext(actionContext, new List<IFilterMetadata>(), objectResult, new object()));
            };

            // Act
            await filter.OnResultExecutionAsync(resultExecutingContext, next);

            // Assert
            Assert.True(nextCalled);
            var wrappedResult = Assert.IsType<OkObjectResult>(resultExecutingContext.Result);
            var apiResponse = Assert.IsType<ApiResponse<object>>(wrappedResult.Value);
            Assert.True(apiResponse.Success);
            Assert.Equal(originalValue, apiResponse.Data);
        }
        
        [Fact]
        public async Task OnResultExecutionAsync_WrapsErrorObjectResult_InErrorResponse()
        {
            // Arrange
            var filter = new ResponseFilter();
            
            var httpContext = new DefaultHttpContext();
            var actionContext = new ActionContext(httpContext, new RouteData(), new ActionDescriptor());
            
            var errorDetails = "Invalid input data";
            var objectResult = new BadRequestObjectResult(errorDetails);
            
            var resultExecutingContext = new ResultExecutingContext(
                actionContext,
                new List<IFilterMetadata>(),
                objectResult,
                new object()
            );

            ResultExecutionDelegate next = () => Task.FromResult(new ResultExecutedContext(actionContext, new List<IFilterMetadata>(), objectResult, new object()));

            // Act
            await filter.OnResultExecutionAsync(resultExecutingContext, next);

            // Assert
            var wrappedResult = Assert.IsType<BadRequestObjectResult>(resultExecutingContext.Result);
            var apiResponse = Assert.IsType<ApiResponse<object>>(wrappedResult.Value);
            Assert.False(apiResponse.Success);
            Assert.Equal("An error occurred", apiResponse.Message);
            Assert.Equal(errorDetails, apiResponse.Data);
        }

        [Fact]
        public async Task OnResultExecutionAsync_WrapsStatusCodeResult_InErrorResponse_WhenStatusCodeIs400OrGreater()
        {
            // Arrange
            var filter = new ResponseFilter();
            
            var httpContext = new DefaultHttpContext();
            var actionContext = new ActionContext(httpContext, new RouteData(), new ActionDescriptor());
            
            var statusCodeResult = new StatusCodeResult(400); // Bad Request
            
            var resultExecutingContext = new ResultExecutingContext(
                actionContext,
                new List<IFilterMetadata>(),
                statusCodeResult,
                new object()
            );

            ResultExecutionDelegate next = () => Task.FromResult(new ResultExecutedContext(actionContext, new List<IFilterMetadata>(), statusCodeResult, new object()));

            // Act
            await filter.OnResultExecutionAsync(resultExecutingContext, next);

            // Assert
            var wrappedResult = Assert.IsType<ObjectResult>(resultExecutingContext.Result);
            Assert.Equal(400, wrappedResult.StatusCode);
            var apiResponse = Assert.IsType<ApiResponse>(wrappedResult.Value);
            Assert.False(apiResponse.Success);
            Assert.Equal("An error occurred", apiResponse.Message);
        }

        [Fact]
        public async Task OnResultExecutionAsync_WrapsEmptyResult_InSuccessResponse()
        {
            // Arrange
            var filter = new ResponseFilter();
            
            var httpContext = new DefaultHttpContext();
            var actionContext = new ActionContext(httpContext, new RouteData(), new ActionDescriptor());
            
            var emptyResult = new EmptyResult();
            
            var resultExecutingContext = new ResultExecutingContext(
                actionContext,
                new List<IFilterMetadata>(),
                emptyResult,
                new object()
            );

            ResultExecutionDelegate next = () => Task.FromResult(new ResultExecutedContext(actionContext, new List<IFilterMetadata>(), emptyResult, new object()));

            // Act
            await filter.OnResultExecutionAsync(resultExecutingContext, next);

            // Assert
            var wrappedResult = Assert.IsType<ObjectResult>(resultExecutingContext.Result);
            Assert.Equal(200, wrappedResult.StatusCode);
            var apiResponse = Assert.IsType<ApiResponse>(wrappedResult.Value);
            Assert.True(apiResponse.Success);
            Assert.Null(apiResponse.Data);
        }
    }
}

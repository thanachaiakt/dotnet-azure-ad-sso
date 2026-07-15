using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using authentication.Middleware;
using authentication.Models;
using Moq;
using Xunit;

namespace Authentication.Tests.Middleware
{
    public class ExceptionHandlingMiddlewareTests
    {
        [Fact]
        public async Task InvokeAsync_CallsNext_WhenNoExceptionOccurs()
        {
            // Arrange
            var context = new DefaultHttpContext();
            bool nextCalled = false;
            RequestDelegate next = (ctx) =>
            {
                nextCalled = true;
                return Task.CompletedTask;
            };

            var mockLogger = new Mock<ILogger<ExceptionHandlingMiddleware>>();
            var middleware = new ExceptionHandlingMiddleware(next, mockLogger.Object);

            // Act
            await middleware.InvokeAsync(context);

            // Assert
            Assert.True(nextCalled);
            Assert.Equal(200, context.Response.StatusCode); // Default code
        }

        [Fact]
        public async Task InvokeAsync_HandlesException_WhenExceptionIsThrown()
        {
            // Arrange
            var context = new DefaultHttpContext();
            var responseStream = new MemoryStream();
            context.Response.Body = responseStream;

            var expectedException = new InvalidOperationException("Test exception message");
            RequestDelegate next = (ctx) => throw expectedException;

            var mockLogger = new Mock<ILogger<ExceptionHandlingMiddleware>>();
            var middleware = new ExceptionHandlingMiddleware(next, mockLogger.Object);

            // Act
            await middleware.InvokeAsync(context);

            // Assert
            // 1. Verify status code
            Assert.Equal((int)HttpStatusCode.InternalServerError, context.Response.StatusCode);
            
            // 2. Verify content type
            Assert.Equal("application/json", context.Response.ContentType);

            // 3. Verify logging occurred (LogError should be called)
            mockLogger.Verify(
                x => x.Log(
                    LogLevel.Error,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => true),
                    expectedException,
                    It.Is<Func<It.IsAnyType, Exception?, string>>((v, t) => true)),
                Times.Once);

            // 4. Verify serialized response body
            responseStream.Position = 0;
            using var reader = new StreamReader(responseStream);
            var responseBody = await reader.ReadToEndAsync();
            
            var apiResponse = JsonSerializer.Deserialize<ApiResponse>(responseBody, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            Assert.NotNull(apiResponse);
            Assert.False(apiResponse.Success);
            Assert.Null(apiResponse.Data);
            Assert.Equal("Internal server error", apiResponse.Message);
        }
    }
}

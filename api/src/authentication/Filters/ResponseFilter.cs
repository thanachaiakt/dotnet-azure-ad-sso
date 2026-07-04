using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using authentication.Models;

namespace authentication.Filters
{
    public class ResponseFilter : IAsyncResultFilter
    {
        public async Task OnResultExecutionAsync(ResultExecutingContext context, ResultExecutionDelegate next)
        {
            if (context.Result is ObjectResult objectResult)
            {
                // Skip if it's already an ApiResponse
                var isApiResponse = objectResult.Value != null && 
                                  objectResult.Value.GetType().IsGenericType &&
                                  objectResult.Value.GetType().GetGenericTypeDefinition() == typeof(ApiResponse<>);

                if (!isApiResponse && !(objectResult.Value is ApiResponse))
                {
                    if (objectResult.StatusCode >= 400)
                    {
                        objectResult.Value = ApiResponse<object>.ErrorResponse("An error occurred", objectResult.Value);
                    }
                    else
                    {
                        objectResult.Value = ApiResponse<object>.SuccessResponse(objectResult.Value);
                    }
                }
            }
            else if (context.Result is StatusCodeResult statusCodeResult)
            {
                if (statusCodeResult.StatusCode >= 400)
                {
                    context.Result = new ObjectResult(ApiResponse.ErrorResponse("An error occurred"))
                    {
                        StatusCode = statusCodeResult.StatusCode
                    };
                }
                else
                {
                    context.Result = new ObjectResult(ApiResponse.SuccessResponse())
                    {
                        StatusCode = statusCodeResult.StatusCode
                    };
                }
            }
            // If the action returned empty/void, wrap it in a success response with null data
            else if (context.Result is EmptyResult)
            {
                context.Result = new ObjectResult(ApiResponse.SuccessResponse())
                {
                    StatusCode = 200
                };
            }

            await next();
        }
    }
}

namespace authentication.Models
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public T? Data { get; set; }
        public string? Message { get; set; }

        public ApiResponse(bool success, T? data, string? message)
        {
            Success = success;
            Data = data;
            Message = message;
        }

        public static ApiResponse<T> SuccessResponse(T data, string? message = null)
        {
            return new ApiResponse<T>(true, data, message);
        }

        public static ApiResponse<T> ErrorResponse(string message, T? data = default)
        {
            return new ApiResponse<T>(false, data, message);
        }
    }

    // Non-generic version for responses without data
    public class ApiResponse : ApiResponse<object>
    {
        public ApiResponse(bool success, object? data, string? message) 
            : base(success, data, message)
        {
        }

        public static ApiResponse SuccessResponse(string? message = null)
        {
            return new ApiResponse(true, null, message);
        }

        public static ApiResponse ErrorResponse(string message)
        {
            return new ApiResponse(false, null, message);
        }
    }
}

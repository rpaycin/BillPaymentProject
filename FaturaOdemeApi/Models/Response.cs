namespace FaturaOdemeApi.Models
{
    public class ExceptionResponse 
    {
        public string ErrorCode { get; set; }

        public string ErrorMessage { get; set; }

        public bool IsSuccess
        {
            get
            {
                return string.IsNullOrEmpty(ErrorMessage); 
            }
        }
    }

    public class Response<T> : ExceptionResponse
    {

        public T Value { get; set; }

    }
}
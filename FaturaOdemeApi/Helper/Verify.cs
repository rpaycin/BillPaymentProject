using System;

namespace FaturaOdemeApi.Helper
{
    public class Verify
    {
        public static void ValidateRequestItem(bool condition, string errorMessage)
        {
            if (!condition)
                throw new Exception(errorMessage);
        }
    }
}
using System;
using System.Configuration;
using System.Text;

namespace FaturaOdemeApi
{
    public class Config
    {
        public static string IyzicoApiKey
        {
            get
            {
                return ConfigurationManager.AppSettings["IyzicoApiKey"];
            }
        }


        public static string IyzicoSecretKey
        {
            get
            {
                return ConfigurationManager.AppSettings["IyzicoSecretKey"];
            }
        }


        public static string IyzicoBaseUrl
        {
            get
            {
                return ConfigurationManager.AppSettings["IyzicoBaseUrl"];
            }
        }

        public static string ApiUserName
        {
            get
            {
                var userBase64 = ConfigurationManager.AppSettings["ApiUserName"];
                return UTF8Encoding.UTF8.GetString(Convert.FromBase64String(userBase64));
            }
        }

        public static string ApiPassword
        {
            get
            {
                var userBase64 = ConfigurationManager.AppSettings["ApiPassword"];
                return UTF8Encoding.UTF8.GetString(Convert.FromBase64String(userBase64));
            }
        }
    }
}
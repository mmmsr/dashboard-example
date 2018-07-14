import os
import datetime


try:
    # Python 2.7
    import ConfigParser as configparser
except ImportError:
    # Python 3
    import configparser

basedir = os.path.abspath(os.path.dirname(__file__))


def _get_bool_env_var(varname, default=None):

    value = os.environ.get(varname, default)

    if value is None:
        return False
    elif isinstance(value, str) and value.lower() == 'false':
        return False
    elif bool(value) is False:
        return False
    else:
        return bool(value)


class BaseConfig(object):
    """Base configuration."""

    # main config
    APP_NAME = 'V9 Admin Dashboard'
    APP_SECRET_KEY = os.environ.get('APP_SECRET_KEY', None)
    SECRET_KEY = os.environ.get('SECRET_KEY', None)
    SECURITY_PASSWORD_SALT = os.environ.get('SECURITY_PASSWORD_SALT', None)
    DEBUG = False
    BCRYPT_LOG_ROUNDS = 13
    WTF_CSRF_ENABLED = True
    DEBUG_TB_ENABLED = False
    DEBUG_TB_INTERCEPT_REDIRECTS = False

    # mail settings
    MAIL_SERVER = os.environ.get('APP_MAIL_SERVER', None)
    MAIL_PORT = int(os.environ.get('APP_MAIL_PORT', 0))
    MAIL_USE_TLS = _get_bool_env_var('APP_MAIL_USE_TLS', False)
    MAIL_USE_SSL = _get_bool_env_var('APP_MAIL_USE_SSL', True)

    # mail authentication
    MAIL_USERNAME = os.environ.get('APP_MAIL_USERNAME', None)
    MAIL_PASSWORD = os.environ.get('APP_MAIL_PASSWORD', None)

    # mail accounts
    MAIL_DEFAULT_SENDER = os.environ.get('APP_MAIL_DEFAULT_SENDER', None)


class DevelopmentConfig(BaseConfig):
    """Development configuration."""
    DEBUG = True
    WTF_CSRF_ENABLED = False

    # サーバーへアクセスできるホストを限定するための設定
    CLIENT_BASE_URL = 'http://localhost:8080'
    # CLIENT_BASE_URL = 'https://v9-admin-dashboard-heroku.herokuapp.com'
    ALLOWED_ORIGINS = [
        CLIENT_BASE_URL
    ]
    CORS_RESOURCES = {
        r'/*': {
            'origins': ALLOWED_ORIGINS
        }
    }

    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', None)
    JWT_BLACKLIST_ENABLED = True
    JWT_BLACKLIST_TOKEN_CHECKS = ['access', 'refresh']
    # JWT_ACCESS_TOKEN_EXPIRES = datetime.timedelta(seconds=10) # 10秒有効
    JWT_ACCESS_TOKEN_EXPIRES = datetime.timedelta(seconds=3600) # 1時間有効
    # JWT_REFRESH_TOKEN_EXPIRES = datetime.timedelta(seconds=30) # 30秒有効
    # JWT_REFRESH_TOKEN_EXPIRES = datetime.timedelta(seconds=259200) # 3日間有効
    JWT_REFRESH_TOKEN_EXPIRES = datetime.timedelta(seconds=86400) # 24時間有効

    MONGODB_SETTINGS = [
        {
            'alias': 'default',
            'db':    os.environ.get('MOGODB_DBNAME', None),
            'host': os.environ.get('MOGODB_HOSTNAME', None),
            # 'ssl': 'true',
            'username':os.environ.get('MOGODB_USERNAME', None),
            'password':os.environ.get('MOGODB_PASSWORD', None)
        }
    ]

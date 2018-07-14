from mongoengine import register_connection
import os


def register_connection_for_inquiry():
    register_connection(
        alias='inquiry',
        host=os.environ.get('MOGODB_HOSTNAME_INQ', None),
        username=os.environ.get('MOGODB_USERNAME_INQ', None),
        password=os.environ.get('MOGODB_PASSWORD_INQ', None)
    )

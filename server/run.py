import os
from flask import Flask
from flask_restful import Api
from flask_mongoengine import MongoEngine
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_mail import Mail


app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
CORS(app, resources=app.config['CORS_RESOURCES'])
api = Api(app)
db = MongoEngine(app)
jwt = JWTManager(app)
mail = Mail(app)


@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token):
    jti = decrypted_token['jti']
    return models.RevokedToken.is_jti_blacklisted(jti)


# import models, resources
import views, models, resources


api.add_resource(resources.UserRegistration, '/register')
api.add_resource(resources.UserConfirmation, '/confirm')
api.add_resource(resources.UserLogin, '/login')

api.add_resource(resources.UserPasswordChange, '/password/change')
api.add_resource(resources.UserPasswordResetRequest, '/password/reset/request')
api.add_resource(resources.UserPasswordResetConfirm, '/password/reset/confirm')

api.add_resource(resources.UserLogoutAccess, '/logout/access')
api.add_resource(resources.UserLogoutRefresh, '/logout/refresh')
api.add_resource(resources.TokenRefresh, '/token/refresh')
api.add_resource(resources.SecretResource, '/secret')
api.add_resource(resources.Inquiries, '/inquiries')

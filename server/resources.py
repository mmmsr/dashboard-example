from flask import jsonify, render_template, url_for, current_app
# from flask import render_template, Blueprint, url_for
from flask_restful import Resource, reqparse
from models import User, RevokedToken, Inquiry
from flask_jwt_extended import (create_access_token, create_refresh_token, jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)
from utils.token import generate_confirmation_token, confirm_token
from utils.email_util import create_email, send_email
from datetime import datetime
import sys


class UserRegistration(Resource):
    def post(self):
        data = request.form
        new_user = User(
            username = data['username'],
            password_hash = User.generate_hash(data['password']),
            email = data['email'],
            confirmed = False
        )

        if User.find_by_email(data['email']):
            return {'message': 'Email {} already used'. format(data['email'])}, 409

        if User.find_by_username(data['username']):
            return {'message': 'User {} already exists'. format(data['username'])}, 409

        try:
            new_user.save_to_db()

            to_addr = new_user.email
            from_addr = current_app.config['MAIL_DEFAULT_SENDER']
            bcc_addr = current_app.config['MAIL_DEFAULT_SENDER']
            password = current_app.config['MAIL_PASSWORD']

            token = generate_confirmation_token(new_user.email)
            confirm_url = current_app.config['CLIENT_BASE_URL'] + '/confirm?token=' + token

            body = render_template('user/activate.html', confirm_url=confirm_url)
            subject = "Please confirm your email"
            msg = create_email(from_addr, to_addr, bcc_addr, subject, body)
            send_email(msg, password)
    
            access_token = create_access_token(identity = data['username'])
            refresh_token = create_refresh_token(identity = data['username'])
            return {
                'message': 'User {} was created'.format( data['username']),
                'access_token': access_token,
                'refresh_token': refresh_token
            }
        except:
            print("Unexpected error:", sys.exc_info()[0])
            return {'message': 'Something went wrong'}, 500


class UserConfirmation(Resource):
    def post(self):
        data = request.form
        current_user = User.find_by_username(data['username'])
        if not current_user:
            print('User {} doesn\'t exist'.format(data['username']))
            return {'message': 'User {} doesn\'t exist'.format(data['username'])}, 401
        if current_user.email != confirm_token(data['token']):
            print('Invalid token')
            return {'message': 'Invalid token'}, 401
        if User.verify_hash(data['password'], current_user.password_hash):
            current_user.confirmed = True
            current_user.save()

            access_token = create_access_token(identity = data['username'])
            refresh_token = create_refresh_token(identity = data['username'])
            return {
                'message': 'Logged in as {}'.format(current_user.username),
                'access_token': access_token,
                'refresh_token': refresh_token
            }
        else:
            print('Wrong credentials')
            return {'message': 'Wrong credentials'}, 401


import traceback
from flask import request
class UserLogin(Resource):
    def post(self):
        print('UserLogin')
        data = request.form
        current_user = User.find_by_username(data['username'])
        if not current_user:
            return {'message': 'User {} doesn\'t exist'.format(data['username'])}, 401
        if not User.verify_hash(data['password'], current_user.password_hash):
            return {'message': 'Wrong credentials'}, 401
        if not current_user.is_authenticated():
            return {'message': 'Not authenticated'}, 401
        access_token = create_access_token(identity = data['username'])
        refresh_token = create_refresh_token(identity = data['username'])
        return {
            'message': 'Logged in as {}'.format(current_user.username),
            'access_token': access_token,
            'refresh_token': refresh_token
        }


# class UserEmailChangeRequest(Resource):
#     def post(self):
#         """Respond to existing user's request to reset their password."""
#         data = request.form

#         if User.find_by_email(data['email']):
#             print('Email {} already used'. format(data['newemail']))
#             return {'message': 'Email {} already used'. format(data['newemail'])}, 409

#         user = User.find_by_email(data['currentemail'])
#         if not user:
#             print('Wrong email: {}'.format(data['currentemail']))
#             return {'message': 'Wrong email: {}'.format(data['currentemail'])}, 401

#         token = user.generate_email_change_token()
        

#         to_addr = user.email
#         from_addr = current_app.config['MAIL_DEFAULT_SENDER']
#         bcc_addr = current_app.config['MAIL_DEFAULT_SENDER']
#         password = current_app.config['MAIL_PASSWORD']

#         reset_link = current_app.config['CLIENT_BASE_URL'] + '/reset?token=' + token

#         body = render_template(
#             'user/reset_password.html',
#             reset_link=reset_link,
#             user=user,
#             app_name=current_app.config['APP_NAME']
#         )
#         subject = 'Reset Your Password'
#         msg = create_email(from_addr, to_addr, bcc_addr, subject, body)
#         send_email(msg, password)

#         return {
#             'message': 'Reset link sent to {}'.format(data['email'])
#         }


class UserPasswordChange(Resource):
    @jwt_required
    def post(self):
        data = request.form
        username = get_jwt_identity()
        current_user = User.find_by_username(username)
        if not current_user:
            print('User {} doesn\'t exist'.format(data['username']))
            return {'message': 'User {} doesn\'t exist'.format(data['username'])}, 401
        if User.verify_hash(data['currentpassword'], current_user.password_hash):
            current_user.password_hash = User.generate_hash(data['newpassword'])
            current_user.save()
            print('Password successfully changed.')
            access_token = create_access_token(identity = username)
            refresh_token = create_refresh_token(identity = username)
            return {
                'message': 'Password successfully changed.',
                'access_token': access_token,
                'refresh_token': refresh_token
            }
        else:
            print('Original password is invalid.')
            return {'message': 'Original password is invalid.'}, 401


class UserPasswordResetRequest(Resource):
    def post(self):
        """Respond to existing user's request to reset their password."""
        data = request.form
        user = User.find_by_email(email=data['email'])
        if user:
            token = user.generate_password_reset_token()

            to_addr = user.email
            from_addr = current_app.config['MAIL_DEFAULT_SENDER']
            bcc_addr = current_app.config['MAIL_DEFAULT_SENDER']
            password = current_app.config['MAIL_PASSWORD']

            reset_link = current_app.config['CLIENT_BASE_URL'] + '/reset?token=' + token

            body = render_template(
                'user/reset_password.html',
                reset_link=reset_link,
                user=user,
                app_name=current_app.config['APP_NAME']
            )
            subject = 'Reset Your Password'
            msg = create_email(from_addr, to_addr, bcc_addr, subject, body)
            send_email(msg, password)

            return {
                'message': 'Reset link sent to {}'.format(data['email'])
            }


class UserPasswordResetConfirm(Resource):
    def post(self):
        data = request.form
        user = User.find_by_email(email=data['email'])
        if user is None:
            print('Invalid email address.')
            return {'message': 'Invalid email address.'}, 401
        if user.reset_password(data['token'], User.generate_hash(data['password'])):
            print('Your password has been updated.')
            return {
                'message': 'Your password has been updated.'
            }
        else:
            print('The password reset link is invalid or has expired.')
            return {'message': 'The password reset link is invalid or has expired.'}, 401


class UserLogoutAccess(Resource):
    @jwt_required
    def post(self):
        jti = get_raw_jwt()['jti']
        try:
            revoked_token = RevokedToken(jti = jti)
            revoked_token.add()
            return {'message': 'Access token has been revoked'}
        except:
            return {'message': 'Something went wrong'}, 500


class UserLogoutRefresh(Resource):
    @jwt_refresh_token_required
    def post(self):
        jti = get_raw_jwt()['jti']
        try:
            revoked_token = RevokedToken(jti = jti)
            revoked_token.add()
            return {'message': 'Refresh token has been revoked'}
        except:
            return {'message': 'Something went wrong'}, 500


class TokenRefresh(Resource):
    @jwt_refresh_token_required
    def post(self):
        current_user = get_jwt_identity()
        access_token = create_access_token(identity = current_user)
        return {'access_token': access_token}


class SecretResource(Resource):
    @jwt_required
    def get(self):
        username = get_jwt_identity()
        return {
            'answer': 42,
            'message': 'Logged in as {}'.format(username)
        }

    @jwt_required
    def post(self):
        print(SecretResource)
        print(request)
        jti = get_raw_jwt()['jti']
        username = get_jwt_identity()
        return {
            'answer': 99,
            'message': 'Logged in as {}'.format(username)
        }


import os
class Inquiries(Resource):
    @jwt_required
    def get(self):
        inquiries = Inquiry.get_all()
        return jsonify({'inquiries': inquiries})

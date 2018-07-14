#################
#### imports ####
#################
from bson.objectid import ObjectId
from datetime import datetime
from run import db
from passlib.hash import pbkdf2_sha256 as sha256
from flask_mongoengine import MongoEngine
from mongoengine.context_managers import switch_db
from utils.multi_db_util import register_connection_for_inquiry
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from itsdangerous import BadSignature, SignatureExpired
from flask import current_app
from itsdangerous import URLSafeTimedSerializer


class User(db.Document):
    username = db.StringField()
    password_hash = db.StringField()
    email = db.EmailField()
    # tmp_email = db.EmailField()
    confirmed = db.BooleanField()
    # registered_on = db.DateTimeField()
    # confirmed_on = db.DateTimeField()
    # password_reset_token = db.StringField()

    def __init__(self,
            username,
            password_hash,
            email,
            # tmp_email,
            confirmed,
            # registered_on,
            # confirmed_on,
            # password_reset_token,
            *args, **kwargs):
        super(db.Document, self).__init__(*args, **kwargs)             
        self.username = username
        self.password_hash = password_hash
        self.email = email
        # self.tmp_email = tmp_email
        self.confirmed = confirmed


########### 
    def full_name(self):
        return self.username + '<' + self.email + '>'

    def generate_confirmation_token(self, expiration=604800):
        """Generate a confirmation token to email a new user."""
        print('test1-1')
        print(current_app.config['SECRET_KEY'])
        print(str(self.id))
        # s = Serializer(current_app.config['SECRET_KEY'], expiration)
        serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
        return serializer.dumps(
            # str(self.id),
            self.email,
            salt=current_app.config['SECURITY_PASSWORD_SALT']
        )
        # print('test1-2')
        # return s.dumps({'confirm': self.id})

    def generate_email_change_token(self, new_email, expiration=3600):
        """Generate an email change token to email an existing user."""
        # s = Serializer(current_app.config['SECRET_KEY'], expiration)
        serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
        return serializer.dumps(
            str(self.id),
            salt=current_app.config['SECURITY_PASSWORD_SALT']
        )
        # return s.dumps({'change_email': self.id, 'new_email': new_email})

    def generate_password_reset_token(self, expiration=3600):
        """
        Generate a password reset change token to email to an existing user.
        """
        serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
        print('self.id:')
        print(str(self.id))
        return serializer.dumps(
            str(self.id),
            # self.email,
            salt=current_app.config['SECURITY_PASSWORD_SALT']
        )

    def confirm_account(self, token, expiration=604800):
        """Verify that the provided token is for this user's id."""
        # s = Serializer(current_app.config['SECRET_KEY'])
        serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
        try:
            # data = s.loads(token)
            print('token:')
            print(token)
            print('SECURITY_PASSWORD_SALT')
            print(current_app.config['SECURITY_PASSWORD_SALT'])
            email = serializer.loads(
                token,
                salt=current_app.config['SECURITY_PASSWORD_SALT'],
                max_age=expiration
            )
        except (BadSignature, SignatureExpired):
            return False
        if email != self.email:
            print('email != self.email')
            return False
        self.confirmed = True
        self.confirmed_on = datetime.now()
        self.save()
        return True

        # if data.get('confirm') != self.id:
        #     return False
        # self.confirmed = True
        # self.confirmed_on = datetime.now()
        # self.save()
        # return True

    def change_email(self, token, expiration=3600):
        """Verify the new email for this user."""
        # s = Serializer(current_app.config['SECRET_KEY'])
        serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])

        try:
            # data = s.loads(token)
            id = serializer.loads(
                token,
                salt=current_app.config['SECURITY_PASSWORD_SALT'],
                max_age=expiration
            )

        except (BadSignature, SignatureExpired):
            print('BadSignature, SignatureExpired')
            return False
        # if data.get('change_email') != self.id:
        if id != str(self.id):
            return False
        new_email = data.get('new_email')
        if new_email is None:
            return False
        if self.query.filter_by(email=new_email).first() is not None:
            return False
        self.email = new_email
        self.save()
        return True

    def reset_password(self, token, new_password_hash, expiration=3600):
        """Verify the new password for this user."""
        serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
        try:
            id = serializer.loads(
                token,
                salt=current_app.config['SECURITY_PASSWORD_SALT'],
                max_age=expiration
            )
        except (BadSignature, SignatureExpired):
            print('BadSignature, SignatureExpired')
            return False
        if id != str(self.id):
            return False
        self.password_hash = new_password_hash
        self.save()
        return True

    def is_authenticated(self):
        return self.confirmed

    # def is_active(self):
    #     return self

    def save_to_db(self):
        self.save()

    @classmethod
    def find_by_username(cls, username):
        return User.objects(username=username).first()

    @classmethod
    def find_by_email(cls, email):
        return User.objects(email=email).first()

    # @classmethod
    # def return_all(cls):
    #     def to_json(x):
    #         return {
    #             'username': x.username,
    #             'password': x.password
    #         }
    #     return {'users': list(map(lambda x: to_json(x), UserModel.query.all()))}

    # @classmethod
    # def delete_all(cls):
    #     try:
    #         num_rows_deleted = db.session.query(cls).delete()
    #         db.session.commit()
    #         return {'message': '{} row(s) deleted'.format(num_rows_deleted)}
    #     except:
    #         return {'message': 'Something went wrong'}

    @staticmethod
    def generate_hash(password):
        return sha256.hash(password)

    @staticmethod
    def verify_hash(password, hash):
        return sha256.verify(password, hash)


class RevokedToken(db.Document):
    jti = db.StringField()

    def add(self):
        self.save()

    @classmethod
    def is_jti_blacklisted(cls, jti):
        revokedToken = RevokedToken.objects(jti=jti).first()
        if revokedToken:
            return True
        else:
            return False
        # return bool(query)





#################
####  class  ####
#################
class Inquiry(db.Document):
    inquiry_type = db.StringField()
    name = db.StringField()
    name_kana = db.StringField()
    company = db.StringField()
    email = db.StringField()
    inquiry = db.StringField()
    isDone = db.BooleanField()
    created_at = db.DateTimeField()

    # username = db.StringField()
    # password = db.StringField()

    # def __init__(self, inquiry_type=None, name=None, name_kana=None, company=None, email=None, inquiry=None, isDone=False, created_at=None):
    #     print("__init__")
    #     # if obj_id is None:
    #     #     self._id = ObjectId()
    #     # else:
    #     #     self._id = obj_id

    #     self.inquiry_type = inquiry_type
    #     self.name = name
    #     self.name_kana = name_kana
    #     self.company = company
    #     self.email = email
    #     self.inquiry = inquiry
    #     self.isDone = isDone
    #     self.created_at = created_at

    # @classmethod
    @staticmethod
    def get_all():
    #     # print(cls)
        register_connection_for_inquiry()
        with switch_db(Inquiry, 'inquiry'):
    #         # inquiry = Inquiry()
    #         inquiry = Inquiry(
    #             inquiry_type='test',
    #             name='test',
    #             name_kana='test',
    #             company='test',
    #             email='test',
    #             inquiry='test',
    #             isDone=False,
    #             created_at=datetime.now()
    #             )
    #         inquiry.save()
            # inquiries = Inquiry.objects.all()
    #         print('inquiries')
    #         # print(inquiries)

            return Inquiry.objects.all()
    #     return 'test'

    def get_as_json(self):
        # print("get_as_json")
        return self.__dict__

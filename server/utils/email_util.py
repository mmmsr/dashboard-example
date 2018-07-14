# utils/email.py
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formatdate
from run import app, mail


FROM_ADDRESS = app.config['MAIL_DEFAULT_SENDER']
MY_PASSWORD = app.config['MAIL_PASSWORD']


def create_email(from_addr, to_addr, bcc_addrs, subject, body):
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = from_addr
    msg['To'] = to_addr
    msg['Bcc'] = bcc_addrs
    msg['Date'] = formatdate()

    part1 = MIMEText(body, 'plain')
    part2 = MIMEText(body, 'html')
    
    # Attach parts into message container.
    # According to RFC 2046, the last part of a multipart message, in this case
    # the HTML message, is best and preferred.
    msg.attach(part1)
    msg.attach(part2)

    return msg


def send_email(msg, password):
    smtpobj = smtplib.SMTP('smtp.gmail.com', 587)
    smtpobj.ehlo()
    smtpobj.starttls()
    smtpobj.ehlo()
    smtpobj.login(msg['From'], password)
    smtpobj.sendmail(msg['From'], msg['To'], msg.as_string())
    smtpobj.close()

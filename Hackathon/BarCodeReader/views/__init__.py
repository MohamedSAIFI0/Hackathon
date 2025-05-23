from flask import Blueprint
app_views=Blueprint('app_views',__name__,url_prefix='/')
from views.DocScanner import *
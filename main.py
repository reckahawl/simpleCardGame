
from flask import  Flask, render_template, url_for, redirect, Request, Response

'''
@after_this_request(f) 
@copy_current_request_context(f)
@escape(s)
@flash()
@get_flashed_messages()
@get_template_attribute()
@has_app_context()
@has_request_context()
@jsonify()
make_response()
redirect()
render_template()
send_file()
send_from_directory()
url_for()
'''
import os

a = os.path.dirname(os.path.abspath(__file__))
t = os.path.join(a, 'templates')


                    

dbg  = Flask(__name__, template_folder=t)
dbg.debug=True

@dbg.route('/index')
def index():
    return render_template('index.html')





    

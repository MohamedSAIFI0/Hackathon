from flask import request
from scan import DocScanner
from views import app_views
from flask import jsonify



@app_views.route('/verifyBarcode',methods=['POST'],strict_slashes=False)
def scan_doc():


    input=request.get_json()
    image_str=input['base64']
    cne=input['cne']
    ds=DocScanner()
    image = ds.base64_to_image(base64_str=image_str)
    
       
    if image.any():
        scan=ds.scan(image)
        if scan==cne:
            return jsonify(True),200
        return jsonify(False),400
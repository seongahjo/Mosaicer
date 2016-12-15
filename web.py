
from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
from flask import Flask, jsonify,request
import compare
import os
app = Flask(__name__)
app.config['UPLOAD_FOLDER']='/root/mosaicer32/image'
@app.route('/',methods=['POST'])
def api():
  results=[]
  for image in request.files.getlist('images'):
    path=os.path.join(app.config['UPLOAD_FOLDER'],image.filename)
    image.save(path)
    output=compare.convert('image/'+image.filename)
    precision=compare.evaluate(output)
    results.append({'precision':precision})
  return jsonify(results=results)

if __name__=='__main__':
  app.run(host='0.0.0.0', port='9999')

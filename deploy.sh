zip -r deploy.zip index.js keys.js node_modules
aws lambda update-function-code \
--function-name loadDataForMirrorDashboard \
--zip-file fileb://deploy.zip
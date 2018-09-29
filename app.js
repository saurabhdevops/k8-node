var http = require('http');
var pkg = require('./package.json');

http.createServer(function (req, res){ 
	res.writeHead(200, {'Content-Type': 'text/html'});
	var cntxt = req.url;
	res.write("<h2><center>Welcome to k8-node</center></h2>");
	if (cntxt.match("/version")) {
		res.write("<p1><center>Application Version\:" + pkg.version +"</center></p1>");
	} else {
		res.write("<p1><center>This app displays version on <b>/version</b> endpoint</center></p1>");
	}
	res.end();
}).listen(8008);
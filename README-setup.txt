Directory structure:

``server'' --- This is the server code.  It goes in Apache HTTPD
               DocumentRoot directory.
							 Point of confusion: this directory also contains the code that
							 runs the client---because the client is written in HTML, the
							 server sends a copy of the client interface to the user's
							 computer so that the user can interact with the server.

							 The client and server processes may be run from the same computer
							 to save bandwidth and increase performance.

``db''     --- This directory conatins SQL scripts for the database, which is
               cannonically a MySQL database named ``NetworkDB'' and (during
							 development, at least) accessible by the root MySQL user.

Map accessible at:          localhost/map
Interface accessible from:  localhost/map/edit

Overview:
	Client uses OpenLayers toolkit and is currently pulling WMS data from OSGeo servers
	Server is written in PHP and queries the MySQL database
	Database currently populated with basic test data

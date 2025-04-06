import http.server
import socketserver

PORT = int(input("Port: "))

class SimpleHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    pass

with socketserver.TCPServer(("", PORT), SimpleHTTPRequestHandler) as httpd:
    print(f"Le serveur HTTP écoute sur le port {PORT}")
    httpd.serve_forever()

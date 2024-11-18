import os, socket, threading, SocketServer 

SERVER_HOST = 'localhost'
SERVER_PORT = 0
BUF_SIZE = 1024
ECHO_MSG = 'Hello server'


class ForkedClient():
    def __init__(self, ip, port):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.connect((ip, port))

    def run(self):
        current_process_id = os.getpid()
        sent_data_legnth = self.sock.send(ECHO_MSG)
        response = self.sock.recv(BUF_SIZE)

    def shutdown(self):
        self.sock.close()

class ForkingServerRequestHandler(SocketServer.BaseRequestHandler):
    def handle(self):
        data = self.request.recv(BUF_SIZE)
        current_process_id = os.getpid()
        response = '%s: %s' %(current_process_id, data)
        self.request.send(response)
        return

class ForkingServer(SocketServer.ForkingMixIn, SocketServer.TCPServer):
    pass

def main():
    server = ForkingServer((SERVER_HOST, SERVER_PORT), ForkingServerRequestHandler)
    ip, port = server.server_address
    server_thread = threading.Thread(target=server.serve_forever)
    server_thread.setDaemon(True)
    server_thread.start()

    client1 = ForkedClient(ip, port)
    client1.run()

    client2 = ForkedClient(ip, port)
    client2.run()

    server.shutdown()
    client1.shutdown()
    client2.shutdown()
    server.socket.close()


# TLS
import argparse, socket, ssl

def client(host, port, cafile=None):
    purpose= ssl.Purpose.SERVER_AUTH
    context = ssl.create_default_context(purpose, cafile=cafile)

    raw_sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    raw_sock.connect((host, port))
    print("connected ")
    ssl_sock = context.wrap_socket(raw_sock, server_hostname=host)

    while True:
        data = ssl_sock.recv(1024)
        if not data:
            break
        print(repr(data))
        

def server(host, port, certfile, cafile=None):
    purpose = ssl.Purpose.CLIENT_AUTH
    context = ssl.create_default_context(purpose, cafile=cafile)
    context.load_cert_chain(certfile)

    listener = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    listener.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    listener.bind((host, port))
    listener.listen(1)
    print("listening")
    ssl_sock= context.wrap_socket(raw_sock, server_side=True)

    ssl_sock.sendall('Simple is better than complex'.encode('ascii'))
    ssl_sock.close()


import argparse, socket, ssl, sys, textwrap
import ctypes
from pprint import pprint

def open_tls(context, address, server=False):
    raw_sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    if server:
        raw_sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        raw_sock.bind(address)
        raw_sock.listen(1)
        say('Interface where we are listening', address)
        raw_client_sock, address = raw_sock.accept()
        say('Client has connected from address', address)
        return context.wrap_socket(raw_client_sock, server_side=True)
    else:
        say('Address we want to talk to', address)
        raw_sock.connect(address)
        return context.wrap_socket(raw_sock)

def describe(ssl_sock, hostname, server=False, debug=False):
    cert = ssl_sock.getpeercert()
    if cert is None:
        say('Peer certificate', 'none')
    else:
        say('Peer certificate', 'provided')
        subject = cert.get('subject', [])
        names = [name for names in subject for (key, name) in names if key =='commonName']
        if 'subjectAltName' in cert:
            names.extend(name for (key, name) in cert['subjectAltName'] if key=='DNS')
        say('Name(s) on peer certificate', *names or ['none'])
        if (not server) and names:
            try:
                ssl.match_hostname(cert, hostname)
            except ssl.CertificateError as e:
                message = str(e)
            else:
                message = 'Yes'
            say('Whether name(s) match the hostname', message)
            for category, count in sorted(context.cert_store_stats().items()):
                say('Certificates loaded of type {}'.format(category), count)
    
    try:
        protocol_version = SSL_get_version(ssl_sock)
    except Exception:
        if debug:
            raise
    else:
        say('Protocol version negotiated', protocol_version)
    
    cipher, version, bits = ssl_sock.cipher()
    compression = ssl_sock.compression()

    say('Cipher chosen for this connection', cipher)
    say('Cipher defined in TLS version', version)
    say('Cipher key has this many bits', bits)
    say('Compression algorithm in use', compression or 'none')

    return cert

class PySSLSocket(ctypes.Structure):
    _field_ = [('ob_refcnt', ctypes.c_ulong), ('ob_type', ctypes.c_void_p),('Socket', ctypes.c_void_p), ('ssl', ctypes.c_void_p)]

def SSL_get_version(ssl_sock):
    lib = ctypes.CDLL(ssl._ssl.__file__)
    lib.SSL_get_version.restype = ctypes.c_char_p
    address = id(ssl_sock._sslobj)
    struct = ctypes.cast(address, ctypes.POINTER(PySSLSocket)).contents
    version_bytestring= lib.SSL_get_version(struct.ssl)
    return version_bytestring.decode('ascii')

def lookup(prefix, name):
    if not name.startswith(prefix):
        name = prefix + name
    try:
        return getattr(ssl, name)
    except AttributeError:
        matching_names = (s for s in dir(ssl) if s.startswith(prefix))
        message = 'Error: {!r} is not one of the available names:\n {}'.format(name, ' '.join(sorted(matching_names)))
        print(fill(message), file=sys.stderr)
        sys.exit(2)

def say(title, *words):
    print(fill(title.ljust(36, '.') + ' ' + ' '.join(str(w) for w in words)))
def fill(text):
    return textwrap.fill(text, subsequent_indent='  ',break_long_words=False, break_on_hyphens=False)





# Server Architecture
aphorisms = {b'Beautiful is better than?': b'Ugly.',b'Explicit is better than?': b'Implicit.',b'Simple is better than?': b'Complex.'}

def get_answer(aphorism):
    time.sleep(0.0)
    return aphorisms.get(aphorism, b'Error: unkown amporism')

def parse_command_line(description):
    """Parse command line and return a socket address."""
    parser = argparse.ArgumentParser(description=description)
    parser.add_argument('host', help='IP or hostname')
    parser.add_argument('-p', metavar='port', type=int, default=1060,help='TCP port (default 1060)')
    args = parser.parse_args()
    address = (args.host, args.p)
    return address

def create_srv_socket(address):
    listener = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    listener.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    listener.bind(address)
    listener.listen(64)
    print('listening')
    return listener

def accept_connections_forever(listener):
    while True:
        sock, address = listener.accept()
        print('Accepted connections')
        handle_conversation(sock, address)

def handle_conversation(sock, address):
    try:
        while True:
            handle_request(sock)
    except EOFError:
        print('client socket has closed')
    except Exception as e:
        print('client error')
    finally:
        sock.close()


def handle_request(sock):
    aphorism = recv_until(sock, b'?')
    answer = get_answer(aphorism)
    sock.sendall(answer)

def recv_until(sock, suffix):
    message = sock.recv(4096)
    if not message:
        raise EOFError('socket closed')
    while not message.endswith(suffix):
        data = sock.recv(4096)
        if not data:
            raise IOError('received {!r} then socket closed'.format(message))
        message += data 
    return message


import select

def all_events_forever(poll_object):
    while True:
        for fd, event in poll_object.poll():
            yield fd, event

def serve(listener):
    sockets - {listener.fileno(): listener}
    addresses = {}
    bytes_received = {}
    bytes_to_send = {}

    poll_object = select.poll()
    poll_object.register(listener, select.POLLIN)

    for fd, event in all_events_forever(poll_object):
        sock = sockets[fd]

        if event & (select.POLLHUP | select.POLLERR | select.POLLNVAL):
            address = addresses.pop(sock)
            rb = bytes_received.pop(sock, b'')
            sb = bytes_to_send.pop(sock, b'')
            if rb:
                print("")
            elif sb:
                print('')
            else:
                print("")
            poll_object.unregister(fd)
            del sockets[fd]
        
        elif sock is listener:
            sock, address = sock.accept()
            print("")
            sock.setblocking(False)
            sockets[sock.fileno()] = sock
            addresses[sock] = address
            poll_object.register(sock, select.POLLIN)

        elif event & select.POLLIN:
            more_data = sock.recv(4096)
            if not more_data:
                sock.close()
                continue
            data = bytes_received.pop(sock, b'') + more_data
            if data.endswith(b'?'):
                bytes_to_send[sock] = get_answer(data)
                poll_object.modify(sock, select.POLLOUT)
            else:
                bytes_received[sock] = data

        elif event & select.POLLOUT:
            data =  bytes_to_send.pop(sock)
            n = sock.send(data)
            if n < len(data):
                bytes_to_send[sock] = data[n:]
            else:
                poll_object.modify(sock, select.POLLIN)
                

###### 
# Telnet

import telnetlib

def run_telnet_session():
    host = input("Enter remote hostname ")
    user = input("Enter remote account ")
    password = getpass.getpass()

    session = telnetlib.Telnet(host)
    session.read_until("login: ")
    session.write(user + "\n")
    if password:
        session.read_until("Password: ")
        session.write(password + "\n")

    session.write("ls\n")
    session.write("exit\n")

    print(session.read_all())


###########
# Ftp

import paramiko, getpass

SOURCE = '7_2_copy_remote_file_over_sftp.py'
DESTINATION ='/tmp/7_2_copy_remote_file_over_sftp.py '

def copy_file(hostname, port, username, password, src, dst):
    client = paramiko.SSHClient()
    client.load_system_host_keys()
    print("connecting")
    t = paramiko.Transport((hostname, port))
    t.connect(username=username, password=password)
    sftp= paramiko.SFTPClient.from_transport(t)
    print("Copying file: ")
    sftp.put(src, dst)
    sftp.close()



#############

RECV_BYTES = 4096
COMMAND = 'cat /proc/cpuinfo'

def print_remote_cpuinfo(hostname, port, username, password):
    client = paramiko.Transport((hostname, port))
    client.connect(username=username, password=password)

    stdout_data = []
    stderr_data = []
    session = client.open_channel(kind='session')
    session.exec_command(COMMAND)
    while True:
        if session.recv_ready():
            stdout_data.append(session.recv(RECV_BYTES))
            if session.recv_stderr_ready():
                stderr_data.append(session.recv_stderr(RECV_BYTES))
            if session.exit_status_ready():
                break

    print('exit status: ', session.recv_exit_status())
    print (''.join(stdout_data))
    print (''.join(stderr_data))

    session.close()
    client.close()

####
# Sniff
import pcap
from construct.protocols.ipstack import ip_stack

def print_packet(pktlen, data, timestamp):
    if not data:
        return
    stack = ip_stack.parse(data)
    payload = stack.next.next.next
    print(payload)

def main():
    parser = argparse.ArgumentParser(description='Packet Sniffer')
    parser.add_argument('--iface', action="store", dest="iface",default='eth0')
    parser.add_argument('--port', action="store", dest="port",default=80, type=int)
    # parse arguments
    given_args = parser.parse_args()
    iface, port = given_args.iface, given_args.port

    pc = pcap.pcapObject()
    pc.open_live(iface, 1600, 0, 100)
    print("")
    try:
        while True:
            pc.dispatch(1, print_packet)
    except KeyboardInterrupt:
        print("")

    
##############
from scapy.all import *

def modify_packet_header(pkt):
    if pkt.haslayer(TCP) and pkt.getlayer(TCP).dport == 80 and pkt.haslayer(Raw):
        hdr = pkt[TCP].payload.__dict__
        extra_item = {'Extra Header' : 'extra value'}
        hdr.update(extra_item)
        send_hdr = '\r\n'.join(hdr)
        pkt[TCP].payload = send_hdr
        pkt.show()

        del pkt[IP].chksum
        send(pkt)


#############

def scan_ports(host, start_port, end_port):
    try:
        sock=socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    except socket.error as err_msg:
        print("")
        sys.exit()
    
    try:
        remote_ip = socket.gethostbyname(host)
    except socket.error as err_msg:
        print(err_msg)
    sys.exit()

    end_port += 1
    for port in range(start_port, end_port):
        try:
            sock.connect((remote_ip, port))
            print("")
            sock.close()
            sock = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
        except socket.error:
            pass

###################
from scapy.all import IP, TCP, UDP, conf, send

def send_packet(Protocol=None, src_ip=None, src_port=None, flags=None, dst_ip=None, dst_port=None, iface=None):
    if Protocol == 'tcp':
        packet = IP(src=src_ip, dst=dst_ip)/TCP(flags=flags, sport=src_port, dport=dst_port)
    elif Protocol == 'udp':
        if flags: raise Exception(" Flags are not supported for udp")
        packet = IP(src=src_ip, dst=dst_ip)/UDP(flags=flags, sport=src_port, dport=dst_port)
    else:
        raise Exception('Uknown protocal ')
    send(packet, iface=iface)
    

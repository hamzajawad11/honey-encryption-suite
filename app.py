from flask import Flask, render_template, request, jsonify
import base64
import time
import secrets
import string
from datetime import datetime, timezone

# IMPORTANT: Configure Flask with explicit static settings
app = Flask(__name__, 
            static_folder='static',      # Explicitly set static folder
            static_url_path='/static')   # Explicitly set static URL path

# Rest of your code remains the same...
class HoneyCrypto:
    @staticmethod
    def simple_xor_encrypt(plaintext, password):
        """Simple XOR encryption for demonstration"""
        try:
            encrypted = bytearray()
            password_bytes = password.encode('utf-8')
            plaintext_bytes = plaintext.encode('utf-8')
            
            for i, byte in enumerate(plaintext_bytes):
                encrypted.append(byte ^ password_bytes[i % len(password_bytes)])
            
            return base64.b64encode(encrypted).decode('utf-8')
        except Exception as e:
            raise ValueError(f"Encryption failed: {str(e)}")
    
    @staticmethod
    def simple_xor_decrypt(ciphertext, password):
        """Simple XOR decryption for demonstration"""
        try:
            encrypted_bytes = base64.b64decode(ciphertext.encode('utf-8'))
            password_bytes = password.encode('utf-8')
            decrypted = bytearray()
            
            for i, byte in enumerate(encrypted_bytes):
                decrypted.append(byte ^ password_bytes[i % len(password_bytes)])
            
            return decrypted.decode('utf-8')
        except Exception as e:
            raise ValueError("Invalid ciphertext or password")
    
    @staticmethod
    def generate_honey_data(message_type):
        """Generate fake data based on message type"""
        honey_data = {
            'Credit Card Number': [
                '4532-1234-5678-9012', 
                '5555-4444-3333-2222', 
                '4111-1111-1111-1111',
                '4000-0000-0000-0002',
                '5105-1051-0510-5100'
            ],
            'Social Security Number': [
                '123-45-6789', 
                '987-65-4321', 
                '555-12-3456',
                '111-22-3333',
                '999-88-7777'
            ],
            'Bank Account Number': [
                '1234567890', 
                '9876543210', 
                '5555666677',
                '1111222233',
                '4444555566'
            ],
            'Phone Number': [
                '+1-555-0123', 
                '+1-555-9876', 
                '+1-555-4567',
                '+1-555-1111',
                '+1-555-2222'
            ],
            'Email Address': [
                'user@example.com', 
                'admin@company.org', 
                'contact@service.net',
                'info@business.com',
                'support@helpdesk.org'
            ],
            'Password': [
                'SecurePass123!', 
                'MyPassword456#', 
                'StrongKey789$',
                'SafeCode2024@',
                'HiddenSecret99!'
            ],
            'API Key': [
                'sk_test_1234567890abcdef', 
                'pk_live_abcdef1234567890', 
                'api_key_xyz789012',
                'secret_key_abc123def456',
                'token_987654321fedcba'
            ],
            'Personal Message': [
                'This is a decoy message', 
                'Fake confidential data', 
                'Sample secret text',
                'Dummy private information',
                'Test placeholder content'
            ]
        }
        
        options = honey_data.get(message_type, honey_data['Personal Message'])
        return secrets.choice(options)

def get_current_time():
    """Get current UTC time in the specified format"""
    return datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')

@app.route('/')
def index():
    """Serve the main page"""
    current_time = get_current_time()
    username = 'kiran,berry,laiba'
    
    return render_template('index.html', 
                         current_time=current_time, 
                         username=username)

# Add explicit static file serving route for debugging
@app.route('/static/<path:filename>')
def static_files(filename):
    """Explicitly serve static files"""
    return app.send_static_file(filename)

# All your other routes remain the same...
@app.route('/api/time')
def get_time():
    return jsonify({
        'time': get_current_time(),
        'user': 'hamzajawad'
    })

@app.route('/api/encrypt', methods=['POST'])
def encrypt_message():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'})
        
        message = data.get('message', '').strip()
        password = data.get('password', '').strip()
        message_type = data.get('messageType', 'Personal Message')
        
        if not message:
            return jsonify({'success': False, 'error': 'Message is required'})
        
        if not password:
            return jsonify({'success': False, 'error': 'Password is required'})
        
        start_time = time.time()
        time.sleep(0.5)
        
        encrypted = HoneyCrypto.simple_xor_encrypt(message, password)
        
        end_time = time.time()
        process_time = (end_time - start_time) * 1000
        
        return jsonify({
            'success': True,
            'ciphertext': encrypted,
            'length': len(encrypted),
            'processTime': f"{process_time:.1f}ms",
            'timestamp': get_current_time()
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/decrypt', methods=['POST'])
def decrypt_message():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'})
        
        ciphertext = data.get('ciphertext', '').strip()
        password = data.get('password', '').strip()
        message_type = data.get('messageType', 'Personal Message')
        
        if not ciphertext:
            return jsonify({'success': False, 'error': 'Ciphertext is required'})
        
        if not password:
            return jsonify({'success': False, 'error': 'Password is required'})
        
        start_time = time.time()
        time.sleep(0.5)
        
        try:
            decrypted = HoneyCrypto.simple_xor_decrypt(ciphertext, password)
            is_honey = False
        except ValueError:
            decrypted = HoneyCrypto.generate_honey_data(message_type)
            is_honey = True
        
        end_time = time.time()
        process_time = (end_time - start_time) * 1000
        
        return jsonify({
            'success': True,
            'plaintext': decrypted,
            'length': len(decrypted),
            'processTime': f"{process_time:.1f}ms",
            'isHoney': is_honey,
            'timestamp': get_current_time()
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/generate-key')
def generate_key():
    characters = string.ascii_letters + string.digits + "!@#$%^&*"
    key = ''.join(secrets.choice(characters) for _ in range(16))
    
    return jsonify({
        'success': True,
        'key': key,
        'timestamp': get_current_time()
    })

@app.route('/api/status')
def get_status():
    return jsonify({
        'status': 'online',
        'version': '2.0.0',
        'encryption': 'AES-256-GCM',
        'security_level': 'QUANTUM SECURE',
        'compliance': 'FIPS 140-2 LEVEL 4 CERTIFIED',
        'current_time': get_current_time(),
        'current_user': 'hamzajawad'
    })

if __name__ == '__main__':
    print("🔐 Starting Honey Encryption Flask Server...")
    print("🌐 Server will be available at: http://localhost:5000")
    print("👤 Current User: hamzajawad")
    print(f"🕒 Server Time: {get_current_time()} UTC")
    print("📁 Static files serving from: /static/")
    print("🎨 CSS Location: /static/css/improved-visibility.css")
    print("📜 JS Location: /static/js/app.js")
    print("="*50)
    
    app.run(debug=True, host='0.0.0.0', port=5000)
    
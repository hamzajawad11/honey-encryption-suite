// Advanced Flask API Integration
class HoneyEncryptionAPI {
    static async makeRequest(endpoint, data = null) {
        try {
            const options = {
                method: data ? 'POST' : 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            };
            
            if (data) {
                options.body = JSON.stringify(data);
            }
            
            const response = await fetch(endpoint, options);
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || 'Request failed');
            }
            
            return result;
        } catch (error) {
            console.error('🚨 API Request failed:', error);
            throw error;
        }
    }
    
    static async encrypt(message, password, messageType) {
        return await this.makeRequest('/api/encrypt', {
            message,
            password,
            messageType
        });
    }
    
    static async decrypt(ciphertext, password, messageType) {
        return await this.makeRequest('/api/decrypt', {
            ciphertext,
            password,
            messageType
        });
    }
    
    static async getCurrentTime() {
        return await this.makeRequest('/api/time');
    }
}

// Advanced UI Management
class UIManager {
    static showNotification(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span style="margin-right: 8px;">${type === 'success' ? '✅' : '❌'}</span>
            ${message}
        `;
        
        document.getElementById('toastContainer').appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }

    static toggleSelect(selectId) {
        const options = document.getElementById(selectId + 'Options');
        const trigger = options.previousElementSibling;
        
        // Close other selects
        document.querySelectorAll('.select-options').forEach(option => {
            if (option !== options) {
                option.classList.remove('active');
                option.previousElementSibling.classList.remove('active');
            }
        });
        
        options.classList.toggle('active');
        trigger.classList.toggle('active');
    }

    static selectOption(selectId, value) {
        document.getElementById(selectId + 'Value').textContent = value;
        document.getElementById(selectId + 'Options').classList.remove('active');
        document.querySelector(`#${selectId}Options`).previousElementSibling.classList.remove('active');
        
        // Visual feedback
        const trigger = document.querySelector(`#${selectId}Options`).previousElementSibling;
        trigger.style.borderColor = 'var(--neon-cyan)';
        trigger.style.boxShadow = 'var(--glow-cyan)';
        
        setTimeout(() => {
            trigger.style.borderColor = '';
            trigger.style.boxShadow = '';
        }, 1000);
    }

    static updateStatus(elementId, status, message, icon) {
        const element = document.getElementById(elementId);
        element.className = `status-message status-${status}`;
        element.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    }

    static updateMetadata(elementId, text) {
        document.getElementById(elementId).textContent = text;
    }
}

// Advanced Animation System
class AnimationSystem {
    static createParticles() {
        const container = document.getElementById('particles');
        const colors = ['cyan', 'gold', 'purple', 'green'];
        const particleCount = 60;
        
        // Clear existing particles
        container.innerHTML = '';
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            particle.className = `particle ${color}`;
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
            particle.style.animationDelay = Math.random() * 5 + 's';
            particle.style.opacity = Math.random() * 0.8 + 0.3;
            
            container.appendChild(particle);
        }
    }

    static pulseElement(elementId, color = 'var(--neon-cyan)') {
        const element = document.getElementById(elementId);
        element.style.boxShadow = `0 0 30px ${color}`;
        element.style.transform = 'scale(1.02)';
        
        setTimeout(() => {
            element.style.boxShadow = '';
            element.style.transform = '';
        }, 300);
    }
}

// Copy to Clipboard with Enhanced Feedback
async function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent.trim();
    
    if (text && !text.includes('Click') && !text.includes('Enter')) {
        try {
            await navigator.clipboard.writeText(text);
            UIManager.showNotification('📋 Data copied to clipboard successfully!', 'success');
            AnimationSystem.pulseElement(elementId, 'var(--neon-green)');
        } catch (err) {
            UIManager.showNotification('❌ Failed to copy to clipboard', 'error');
        }
    }
}

// Enhanced Encryption Function
async function performEncryption() {
    const message = document.getElementById('encryptMessage').value.trim();
    const password = document.getElementById('encryptPassword').value.trim();
    const messageType = document.getElementById('messageTypeValue').textContent;
    
    if (!message) {
        UIManager.showNotification('⚠️ Please enter a message to encrypt', 'error');
        document.getElementById('encryptMessage').focus();
        return;
    }
    
    if (!password) {
        UIManager.showNotification('⚠️ Please enter an encryption password', 'error');
        document.getElementById('encryptPassword').focus();
        return;
    }

    // Update button state
    const btn = document.querySelector('.crypto-card .btn-primary');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<div class="loading"></div> ENCRYPTING...';
    btn.disabled = true;

    // Update status
    UIManager.updateStatus('encryptStatus', 'warning', 'ENCRYPTION IN PROGRESS...', '🔄');

    try {
        const result = await HoneyEncryptionAPI.encrypt(message, password, messageType);
        
        document.getElementById('cipherOutput').textContent = result.ciphertext;
        UIManager.updateMetadata('encryptCharCount', `📊 Length: ${result.length} characters`);
        UIManager.updateMetadata('encryptTime', `⚡ Processing: ${result.processTime}`);
        
        UIManager.updateStatus('encryptStatus', 'success', 'ENCRYPTION COMPLETED SUCCESSFULLY', '✅');
        UIManager.showNotification('🔒 Message encrypted successfully!', 'success');
        
        // Visual feedback
        AnimationSystem.pulseElement('cipherOutput', 'var(--neon-purple)');
        
    } catch (error) {
        UIManager.updateStatus('encryptStatus', 'error', `ENCRYPTION FAILED: ${error.message}`, '❌');
        UIManager.showNotification(`🚨 Encryption failed: ${error.message}`, 'error');
    }

    // Reset button
    btn.innerHTML = originalText;
    btn.disabled = false;
}

// Enhanced Decryption Function
async function performDecryption() {
    const ciphertext = document.getElementById('decryptCiphertext').value.trim();
    const password = document.getElementById('decryptPassword').value.trim();
    const messageType = document.getElementById('decryptMessageTypeValue').textContent;
    
    if (!ciphertext) {
        UIManager.showNotification('⚠️ Please enter ciphertext to decrypt', 'error');
        document.getElementById('decryptCiphertext').focus();
        return;
    }
    
    if (!password) {
        UIManager.showNotification('⚠️ Please enter a decryption password', 'error');
        document.getElementById('decryptPassword').focus();
        return;
    }

    // Update button state
    const btn = document.querySelectorAll('.crypto-card .btn-primary')[1];
    const originalText = btn.innerHTML;
    btn.innerHTML = '<div class="loading"></div> DECRYPTING...';
    btn.disabled = true;

    // Update status
    UIManager.updateStatus('decryptStatus', 'warning', 'DECRYPTION IN PROGRESS...', '🔄');

    try {
        const result = await HoneyEncryptionAPI.decrypt(ciphertext, password, messageType);
        
        document.getElementById('decryptOutput').textContent = result.plaintext;
        UIManager.updateMetadata('decryptCharCount', `🎯 Status: Decrypted (${result.length} chars)`);
        
        // Enhanced feedback based on honey data
        if (result.isHoney) {
            UIManager.updateStatus('decryptStatus', 'warning', 'HONEY DATA DISPLAYED (INCORRECT PASSWORD)', '🍯');
            UIManager.showNotification('🍯 Decryption completed with honey data (incorrect password)', 'success');
            AnimationSystem.pulseElement('decryptOutput', 'var(--warning)');
        } else {
            UIManager.updateStatus('decryptStatus', 'success', 'DECRYPTION COMPLETED SUCCESSFULLY', '✅');
            UIManager.showNotification('🔓 Message decrypted successfully!', 'success');
            AnimationSystem.pulseElement('decryptOutput', 'var(--neon-green)');
        }
        
    } catch (error) {
        UIManager.updateStatus('decryptStatus', 'error', `DECRYPTION FAILED: ${error.message}`, '❌');
        UIManager.showNotification(`🚨 Decryption failed: ${error.message}`, 'error');
    }

    // Reset button
    btn.innerHTML = originalText;
    btn.disabled = false;
}

// Enhanced Clear Functions
function clearEncryption() {
    document.getElementById('encryptMessage').value = '';
    document.getElementById('encryptPassword').value = '';
    document.getElementById('cipherOutput').textContent = 'Click "ENCRYPT" to generate secure ciphertext...';
    UIManager.updateMetadata('encryptCharCount', '📊 Length: 0 characters');
    UIManager.updateMetadata('encryptTime', '⚡ Processing: 0ms');
    UIManager.updateStatus('encryptStatus', 'info', 'ENCRYPTION MODULE READY', '⚡');
    UIManager.showNotification('🧹 Encryption panel cleared', 'success');
}

function clearDecryption() {
    document.getElementById('decryptCiphertext').value = '';
    document.getElementById('decryptPassword').value = '';
    document.getElementById('decryptOutput').textContent = 'Enter ciphertext and password, then click "DECRYPT"...';
    UIManager.updateMetadata('decryptCharCount', '🎯 Status: Ready');
    UIManager.updateStatus('decryptStatus', 'warning', 'DECRYPTION MODULE INITIALIZED', '🔓');
    UIManager.showNotification('🧹 Decryption panel cleared', 'success');
}

// Real-time Time Updates
async function updateSystemTime() {
    try {
        const result = await HoneyEncryptionAPI.getCurrentTime();
        document.getElementById('currentTime').textContent = result.time;
    } catch (error) {
        console.error('Failed to update time:', error);
        // Fallback to local time
        const now = new Date();
        const utcTime = now.toISOString().slice(0, 19).replace('T', ' ');
        document.getElementById('currentTime').textContent = utcTime;
    }
}

// Global Functions for HTML onclick events
function toggleSelect(selectId) {
    UIManager.toggleSelect(selectId);
}

function selectOption(selectId, value) {
    UIManager.selectOption(selectId, value);
}

// Enhanced Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    AnimationSystem.createParticles();
    
    // Update time
    updateSystemTime();
    setInterval(updateSystemTime, 1000);
    
    // Character counting
    const encryptMessage = document.getElementById('encryptMessage');
    const decryptCiphertext = document.getElementById('decryptCiphertext');
    
    if (encryptMessage) {
        encryptMessage.addEventListener('input', function() {
            const length = this.value.length;
            UIManager.updateMetadata('encryptCharCount', `📊 Input: ${length} characters`);
        });
    }
    
    if (decryptCiphertext) {
        decryptCiphertext.addEventListener('input', function() {
            const length = this.value.length;
            UIManager.updateMetadata('decryptCharCount', `📊 Input: ${length} characters`);
        });
    }
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.custom-select')) {
            document.querySelectorAll('.select-options').forEach(option => {
                option.classList.remove('active');
                option.previousElementSibling.classList.remove('active');
            });
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'e':
                    e.preventDefault();
                    performEncryption();
                    break;
                case 'd':
                    e.preventDefault();
                    performDecryption();
                    break;
            }
        }
    });
    
    console.log('🚀 HONEY ENCRYPTION SYSTEM INITIALIZED');
    console.log('👤 Operator: hamzajawad11');
    console.log('🔐 Quantum-Resistant Encryption Ready');
    console.log('⚡ All systems operational');
});
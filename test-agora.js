
try {
    const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
    console.log('✅ Require successful');
    console.log('Builder:', RtcTokenBuilder);
} catch (e) {
    console.error('❌ Require failed:', e);
}

import Vapi from '@vapi-ai/web';

const VAPI_API_KEY = process.env.NEXT_PUBLIC_VAPI_API_KEY;

// Vapi's web SDK holds one active call at a time, so a single shared client
// instance is intentional here — kept explicit at module scope rather than
// hidden inside a hook, since every useVapi() consumer must share it.
let vapiInstance: InstanceType<typeof Vapi> | undefined;

export function getVapi(): InstanceType<typeof Vapi> {
    if (!vapiInstance) {
        if (!VAPI_API_KEY) {
            throw new Error('NEXT_PUBLIC_VAPI_API_KEY environment variable is not set');
        }
        vapiInstance = new Vapi(VAPI_API_KEY);
    }
    return vapiInstance;
}
